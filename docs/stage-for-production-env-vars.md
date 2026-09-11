# Stage-for-Production: environment variables per environment

The cross-environment "Stage for Production" promotion flow (`MMT-4199`) introduces
five environment variables. This document describes how to set them across the
three deployed environments — **SIT**, **UAT**, and **PROD** — where SIT is a test
bed and UAT → PROD is the real promotion path.

## The variables

| Variable | Role | Bamboo plan variable | Required? |
|---|---|---|---|
| `STAGING_SECRET_API_KEY` | **Inbound** secret this environment accepts on the `Staging-Api-Key` header | `bamboo_STAGING_SECRET_API_KEY` (secret) | **always required** (deployed environments) |
| `STAGING_CONCEPTS_BUCKET_NAME` | This environment's concepts bucket — leave at the `mmt-${STAGE_NAME}-staging-concepts` default | `bamboo_STAGING_CONCEPTS_BUCKET_NAME` | **always required** |
| `STAGING_TARGET_API_HOST` | **Outbound** — API Gateway base URL the `stageConceptForProduction` Lambda `PUT`s to | `bamboo_STAGING_TARGET_API_HOST` | optional — **the on/off switch.** Leave undefined to disable forwarding from this environment; empty ⇒ the handler returns `500` |
| `STAGING_TARGET_MMT_HOST` | UI host used to build the deep link returned to the browser (`stagedConceptLink` in the response) | `bamboo_STAGING_TARGET_MMT_HOST` | required *only if* `STAGING_TARGET_API_HOST` is set — otherwise leave undefined too |
| `STAGING_TARGET_SECRET_API_KEY` | **Outbound** secret sent to the target environment; must equal the target's `STAGING_SECRET_API_KEY` | `bamboo_STAGING_TARGET_SECRET_API_KEY` (secret) | required *only if* `STAGING_TARGET_API_HOST` is set — otherwise leave undefined too |

**The three `STAGING_TARGET_*` variables are optional only as a group, not
individually.** Leave all three undefined to disable forwarding from this environment —
`deploy-bamboo.sh` defaults each to empty (`${bamboo_STAGING_TARGET_*:-}`), so a plan that
doesn't forward can skip them entirely. But the moment you set `STAGING_TARGET_API_HOST`
to turn forwarding *on*, the other two become mandatory, and this is enforced twice:

- **At deploy time:** `cdk synth` (`cdk/mmt/lib/mmt-stack.ts`) throws if
  `STAGING_TARGET_API_HOST` is set while `STAGING_TARGET_MMT_HOST` is missing, or while
  `STAGING_TARGET_SECRET_API_KEY` is missing or still the placeholder — so a half-configured
  Bamboo plan fails the deploy instead of shipping broken.
- **At request time:** `stageConceptForProduction` also fails closed with a `500` if any of
  the three is missing, as a second line of defense (e.g. if the guard were ever
  bypassed, or a value went empty after deploy).

So there are really only two valid states per environment: **all three unset** (no
forwarding), or **all three set together**.

## Per environment

### PROD — final destination (receives, never forwards)

| Variable | Value |
|---|---|
| `STAGING_SECRET_API_KEY` | `<prod-secret>` — real, unique, non-placeholder. This is the key UAT uses to push in. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-prod-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | leave undefined — PROD is a forwarding target, not a sender |
| `STAGING_TARGET_MMT_HOST` | leave undefined (see above: only required when `STAGING_TARGET_API_HOST` is set) |
| `STAGING_TARGET_SECRET_API_KEY` | leave undefined (see above) |

### UAT — real promotion source → PROD

| Variable | Value |
|---|---|
| `STAGING_SECRET_API_KEY` | `<uat-secret>` — real, unique. Used if you also test SIT → UAT, and good hygiene regardless. |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-uat-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | PROD's API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | PROD's MMT UI host |
| `STAGING_TARGET_SECRET_API_KEY` | **exactly** PROD's `STAGING_SECRET_API_KEY` |

### SIT — test bed

SIT has two viable configurations for what it promotes into.

**Option A — SIT → UAT (recommended).** Exercises the real
cross-account / VPC → private-API-Gateway path, which is the riskiest part of the
flow. Downside: it writes transient staged concepts into UAT's bucket (they
self-expire after 30 days).

| Variable | Value |
|---|---|
| `STAGING_SECRET_API_KEY` | `<sit-secret>` — real, unique |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-sit-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | UAT's API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | UAT's MMT UI host |
| `STAGING_TARGET_SECRET_API_KEY` | **exactly** UAT's `STAGING_SECRET_API_KEY` |

**Option B — SIT → SIT loopback.** Self-contained, does not touch UAT, but does
**not** test cross-account networking — the forwarding Lambda calls its own
environment's API Gateway.

| Variable | Value |
|---|---|
| `STAGING_SECRET_API_KEY` | `<sit-secret>` |
| `STAGING_CONCEPTS_BUCKET_NAME` | default (`mmt-sit-staging-concepts`) |
| `STAGING_TARGET_API_HOST` | SIT's own API Gateway base URL |
| `STAGING_TARGET_MMT_HOST` | SIT's own MMT UI host |
| `STAGING_TARGET_SECRET_API_KEY` | SIT's own `STAGING_SECRET_API_KEY` (same value) |

