# Stage-for-Production: environment variables per environment

The cross-environment "Stage for Production" promotion flow (`MMT-4199`) introduces
five environment variables. This document describes how to set them across the
three deployed environments — **SIT**, **UAT**, and **PROD** — where SIT is a test
bed and UAT → PROD is the real promotion path.

## The one invariant

The flow is a one-directional "push upward" chain. The single rule that must hold:

> **The sender's `STAGING_TARGET_API_KEY` must be byte-for-byte equal to the
> receiver's `STAGING_API_KEY`.**

That shared secret is the only credential in front of the machine-to-machine
`PUT /staged/{conceptType}` route — it is verified by the `stagingApiKeyAuthorizer`
API Gateway authorizer.

## The variables

| Variable | Role | Bamboo plan variable | Required? |
|---|---|---|---|
| `STAGING_API_KEY` | **Inbound** secret this environment accepts on the `Staging-Api-Key` header | `bamboo_STAGING_API_KEY` (secret) | **required** (deployed) |
| `STAGING_CONCEPTS_BUCKET_NAME` | This environment's concepts bucket — leave at the `mmt-${STAGE_NAME}-staging-concepts` default | `bamboo_STAGING_CONCEPTS_BUCKET_NAME` | required |
| `STAGING_TARGET_API_HOST` | **Outbound** — API Gateway base URL the `stageConceptForProduction` Lambda `PUT`s to. Empty ⇒ the handler returns `500` (forwarding disabled) | `bamboo_STAGING_TARGET_API_HOST` | optional |
| `STAGING_TARGET_MMT_HOST` | UI host used to build the deep link returned to the browser (`productionUrl` in the response) | `bamboo_STAGING_TARGET_MMT_HOST` | optional |
| `STAGING_TARGET_API_KEY` | **Outbound** secret sent to the target environment; must equal the target's `STAGING_API_KEY` | `bamboo_STAGING_TARGET_API_KEY` (secret) | optional |

`deploy-bamboo.sh` passes all of these through Docker → CDK → Lambda. The three
`STAGING_TARGET_*` values are **optional**: the script defaults them to empty
(`${bamboo_STAGING_TARGET_*:-}`), so only environments that actually forward staged
concepts need to define the `bamboo_STAGING_TARGET_*` plan variables (and mark
`bamboo_STAGING_TARGET_API_KEY` secret). Every other environment can leave them undefined.

## Per environment

### PROD — final destination (receives, never forwards)

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<prod-secret>` — real, unique, non-placeholder. This is the key UAT uses to push in. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-prod-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | leave the `bamboo_*` plan variable undefined |
| `STAGING_TARGET_MMT_HOST` | leave undefined |
| `STAGING_TARGET_API_KEY` | leave undefined — the synth guard only fires when `STAGING_TARGET_API_HOST` is also set |

### UAT — real promotion source → PROD

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<uat-secret>` — real, unique. Used if you also test SIT → UAT, and good hygiene regardless. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-uat-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | PROD's API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | PROD's MMT UI host |
| `STAGING_TARGET_API_KEY` | **exactly** PROD's `STAGING_API_KEY` |

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
| `STAGING_TARGET_API_HOST` | UAT's API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | UAT's MMT UI host |
| `STAGING_TARGET_API_KEY` | **exactly** UAT's `STAGING_API_KEY` |

**Option B — SIT → SIT loopback.** Self-contained, does not touch UAT, but does
**not** test cross-account networking — the forwarding Lambda calls its own
environment's API Gateway.

| Variable | Value |
|---|---|
| `STAGING_API_KEY` | `<sit-secret>` |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-sit-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | SIT's own API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | SIT's own MMT UI host |
| `STAGING_TARGET_API_KEY` | SIT's own `STAGING_API_KEY` (same value) |

## Notes and gotchas

- **Synth guard** (`cdk/mmt/lib/mmt-stack.ts`): when `NODE_ENV=production` (every
  Bamboo deploy sets this), `cdk synth` **throws** if:
  - `STAGING_API_KEY` is missing or still the source-controlled placeholder
    `local-staging-api-key`; or
  - `STAGING_TARGET_API_HOST` is set while `STAGING_TARGET_API_KEY` is missing or
    the placeholder.

  So each deployed plan must define real secrets or the deploy fails fast.
- Use **three distinct random secrets**, one per environment's `STAGING_API_KEY`.
  UAT's `STAGING_TARGET_API_KEY` is a copy of PROD's secret; SIT's (Option A)
  is a copy of UAT's — the same secret under two names, not a fourth secret.
- **Networking is not code.** The UAT Lambda is in-VPC and must be able to reach
  PROD's private API Gateway — this likely needs PrivateLink / VPC peering / a
  regional endpoint. The same applies to SIT → UAT (Option A). Option B
  (SIT → SIT) still calls SIT's own API Gateway but stays within one account.
- `STAGING_CONCEPTS_BUCKET_NAME` normally needs no override — the CDK stack
  creates `mmt-${STAGE_NAME}-staging-concepts` (30-day object expiration,
  `RemovalPolicy: RETAIN`, public access blocked, SSE-S3). If that bucket was
  ever pre-created manually, `cdk import` or delete it before the first deploy.
