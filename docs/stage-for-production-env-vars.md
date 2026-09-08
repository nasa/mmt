# Stage-for-Production: environment variables per environment

The cross-environment "Stage for Production" promotion flow (`MMT-4199`) introduces
five environment variables. This document describes how to set them across the
three deployed environments — **SIT**, **UAT**, and **PROD** — where SIT is a test
bed and UAT → PROD is the real promotion path.

## The one invariant

The flow is a one-directional "push upward" chain. The single rule that must hold:

> **The sender's `PRODUCTION_STAGING_API_KEY` must be byte-for-byte equal to the
> receiver's `STAGING_API_KEY`.**

That shared secret is the only credential in front of the machine-to-machine
`PUT /providers/{providerId}/{conceptType}/{nativeId}` route — it is verified by the
`stagingApiKeyAuthorizer` API Gateway authorizer and re-checked inside the
`createOrUpdateConcept` handler.

## The variables

| Variable | Role | Set via (Bamboo) |
|---|---|---|
| `STAGING_API_KEY` | **Inbound** secret this environment accepts on the `Staging-Api-Key` header | `bamboo_STAGING_API_KEY` (secret) |
| `STAGING_CONCEPTS_BUCKET_NAME` | This environment's concepts bucket | `bamboo_STAGING_CONCEPTS_BUCKET_NAME` — leave at the `mmt-${STAGE_NAME}-staging-concepts` default |
| `PRODUCTION_API_HOST` | **Outbound** — API Gateway base URL the `stageConceptForProduction` Lambda `PUT`s to. Empty ⇒ the handler returns `500` (promotion disabled) | `bamboo_PRODUCTION_API_HOST` |
| `PRODUCTION_MMT_HOST` | UI host used to build the deep link returned to the browser (`productionUrl` in the response) | `bamboo_PRODUCTION_MMT_HOST` |
| `PRODUCTION_STAGING_API_KEY` | **Outbound** secret sent to the target environment; must equal the target's `STAGING_API_KEY` | `bamboo_PRODUCTION_STAGING_API_KEY` (secret) |

`deploy-bamboo.sh` already forwards all five `bamboo_*` variables through
Docker → CDK → Lambda, so the only work is defining the plan variables in each
environment's Bamboo deploy plan (mark the two key variables as secret).

## Per environment

### PROD — final destination (receives, never forwards)

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<prod-secret>` — real, unique, non-placeholder. This is the key UAT uses to push in. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-prod-staging-concepts`) |
| `PRODUCTION_API_HOST` | **unset / empty** |
| `PRODUCTION_MMT_HOST` | **unset / empty** |
| `PRODUCTION_STAGING_API_KEY` | leave unset — the synth guard only fires when `PRODUCTION_API_HOST` is also set |

### UAT — real promotion source → PROD

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<uat-secret>` — real, unique. Used if you also test SIT → UAT, and good hygiene regardless. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-uat-staging-concepts`) |
| `PRODUCTION_API_HOST` | PROD's API Gateway base URL |
| `PRODUCTION_MMT_HOST` | PROD's MMT UI host |
| `PRODUCTION_STAGING_API_KEY` | **exactly** PROD's `STAGING_API_KEY` |

### SIT — test bed

SIT has two viable configurations for what it promotes into.

**Option A — SIT → UAT (recommended).** Exercises the real
cross-account / VPC → private-API-Gateway path, which is the riskiest part of the
flow. Downside: it writes transient staged concepts into UAT's bucket (they
self-expire after 30 days).

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<sit-secret>` — real, unique |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-sit-staging-concepts`) |
| `PRODUCTION_API_HOST` | UAT's API Gateway base URL |
| `PRODUCTION_MMT_HOST` | UAT's MMT UI host |
| `PRODUCTION_STAGING_API_KEY` | **exactly** UAT's `STAGING_API_KEY` |

**Option B — SIT → SIT loopback.** Self-contained, does not touch UAT, but does
**not** test cross-account networking. This is what
`scripts/localStagingConceptsTesting/local-env.sh` does locally, so it is a
known-good configuration.

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<sit-secret>` |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-sit-staging-concepts`) |
| `PRODUCTION_API_HOST` | SIT's own API Gateway base URL |
| `PRODUCTION_MMT_HOST` | SIT's own MMT UI host |
| `PRODUCTION_STAGING_API_KEY` | SIT's own `STAGING_API_KEY` (same value) |

## Notes and gotchas

- **Synth guard** (`cdk/mmt/lib/mmt-stack.ts`): when `NODE_ENV=production` (every
  Bamboo deploy sets this), `cdk synth` **throws** if:
  - `STAGING_API_KEY` is missing or still the source-controlled placeholder
    `local-staging-api-key`; or
  - `PRODUCTION_API_HOST` is set while `PRODUCTION_STAGING_API_KEY` is missing or
    the placeholder.

  So each deployed plan must define real secrets or the deploy fails fast.
- Use **three distinct random secrets**, one per environment's `STAGING_API_KEY`.
  UAT's `PRODUCTION_STAGING_API_KEY` is a copy of PROD's secret; SIT's (Option A)
  is a copy of UAT's — the same secret under two names, not a fourth secret.
- **Networking is not code.** The UAT Lambda is in-VPC and must be able to reach
  PROD's private API Gateway — this likely needs PrivateLink / VPC peering / a
  regional endpoint. The same applies to SIT → UAT (Option A). Option B
  (SIT → SIT) still calls SIT's own API Gateway but stays within one account.
- `STAGING_CONCEPTS_BUCKET_NAME` normally needs no override — the CDK stack
  creates `mmt-${STAGE_NAME}-staging-concepts` (30-day object expiration,
  `RemovalPolicy: RETAIN`, public access blocked, SSE-S3). If that bucket was
  ever pre-created manually, `cdk import` or delete it before the first deploy.
