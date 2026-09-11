# Stage-for-Production: what changed

Implementation of [stage-for-production-plan.md](./stage-for-production-plan.md). All
changes synthesize, lint, and test green.

## Part 0 — S3 retention

`cdk/mmt/lib/mmt-stack.ts`

- New `s3.Bucket` `StagingConceptsBucket` (`mmt-<stage>-staging-concepts`) with an
  `expire-staged-concepts` lifecycle rule — 30-day object expiration —
  `DeletionPolicy: Retain`, public access blocked, SSE-S3. Verified in the synthesized
  template (`ExpirationInDays: 30`, `Status: Enabled`, `DeletionPolicy: Retain`).

## Part 1 — Production side

- `serverless/src/stagingApiKeyAuthorizer/handler.js` — new REQUEST authorizer keyed on
  the `Staging-Api-Key` header; offline bypass; fails closed when `STAGING_SECRET_API_KEY` is
  unset; `throw 'Unauthorized'` on mismatch. Plus `__tests__/handler.test.js`.
- `cdk/mmt/lib/mmt-authorizers.ts` — refactored to a shared `makeRequestAuthorizer`
  helper; adds `stagingApiKeyAuthorizer` alongside `edlAuthorizer` (EDL authorizer
  logical IDs unchanged).
- `cdk/mmt/lib/mmt-functions.ts` — only `createStagedConcept` (PUT) moves to
  `stagingApiKeyAuthorizer`: it is the single machine-to-machine route, called
  cross-environment by the UAT `stageConceptForProduction` Lambda with the shared key.
  `getStagedConcepts`, `getStagedConcept`, and `deleteStagedConcept` stay on `edlAuthorizer` (real
  browser users). Verified in the synthesized template: `PUT` → `AuthorizationType:
  CUSTOM` referencing `StagingApiKeyAuthorizer`; the GET/GET-list/DELETE methods →
  `EdlAuthorizer`; `templates` / `users` still → EDL.
- `serverless/src/createStagedConcept/handler.js`:
  - Dropped the `fetchProviders` import and the per-user provider-permission block
    (the UAT forwarding Lambda is trusted to have done that authorization).
  - Kept the in-handler `Staging-Api-Key` check (the local runner `bin/api.mjs` does not
    invoke authorizers) with a comment explaining why.
  - Now returns `{ conceptType, nativeId, providerId }` in the response body so the
    caller can build a deep link.
- `serverless/src/{getStagedConcept,getStagedConcepts,deleteStagedConcept}/handler.js` — unchanged auth
  model: `edlAuthorizer` + the in-handler `fetchProviders` per-user provider check.
  (`deleteStagedConcept` keeps the simplified idempotent S3 delete — no `HeadObject`
  preflight.)
- `cdk/mmt/lib/mmt-stack.ts` — `Staging-Api-Key` added to the CORS `allowHeaders` list.
- `createStagedConcept/__tests__/handler.test.js` — removed the provider-authz /
  `fetchProviders`-error cases; added a body assertion to the success test. The
  `getStagedConcept` / `getStagedConcepts` / `deleteStagedConcept` suites keep their
  provider-authz / `fetchProviders`-error coverage.

## Part 2 — UAT forwarding Lambda

- `serverless/src/stageConceptForProduction/handler.js` —
  `POST /providers/{providerId}/{conceptType}/{nativeId}/stage-for-production`, behind
  `edlAuthorizer`. Validates `conceptType` and the request body, runs the per-user
  `fetchProviders` check, then `PUT`s the body to
  `${STAGING_TARGET_API_HOST}/providers/{providerId}/{conceptType}/{nativeId}` with a
  `Staging-Api-Key: ${STAGING_TARGET_SECRET_API_KEY}` header. Returns
  `{ providerId, conceptType, nativeId, productionUrl }` on success, `502` if Production
  rejects or the call fails, `500` if promotion is not configured for the environment.
  Plus `__tests__/handler.test.js` (8 tests).
- `cdk/mmt/lib/mmt-shared-api-gateway-resources.ts` — new `stage-for-production` API
  Gateway resource under `{nativeId}` plus its CORS `OPTIONS` method.
- `cdk/mmt/lib/mmt-functions.ts` — `StageConceptForProductionLambda` (default Lambda
  role — it touches no S3).
- `cdk/mmt/lib/mmt-stack.ts` — `STAGING_TARGET_API_HOST`, `STAGING_TARGET_MMT_HOST`,
  `STAGING_TARGET_SECRET_API_KEY` added to the Lambda environment (dev-safe defaults; only
  meaningfully set for the UAT deployment).
- `bin/deploy-bamboo.sh` — passes `bamboo_STAGING_TARGET_API_HOST`,
  `bamboo_STAGING_TARGET_MMT_HOST`, `bamboo_STAGING_TARGET_API_KEY` into the deploy
  container, defaulted to empty (`${bamboo_STAGING_TARGET_*:-}`) so they stay optional
  under the script's `set -u` — only forwarding environments need to define them.

## Part 3 — Local testing

An earlier revision of this branch added helper scripts under
`scripts/localStagingConceptsTesting/` (a `local-env.sh` plus per-route curl scripts). They
were **removed** — see "Running locally" below for the equivalent manual steps.

## Part 4 — Restructure: drop the provider/native tuple, route under `/staged`

The concept store no longer models a `providerId / conceptType / nativeId` tuple. A staged
concept is an opaque promotion artifact identified only by a generated `recordId` (UUID).

- **S3 key:** `{conceptType}/{recordId}` for every concept handler.
- **Handlers renamed** to carry the word `Staged`: `getStagedConcept`,
  `createStagedConcept` (originally `createOrUpdateStagedConcept` — renamed again since
  every `PUT` generates a brand-new `recordId`, so it never actually updates an existing
  record), `deleteStagedConcept` (directories and `functionName`s too).
- **The list endpoint was removed** — the former `getConcepts` / `getStagedConcepts`
  handler, its route, and its API Gateway resource method are all gone. There is no
  `GET /staged/{conceptType}`.
- **Routes** (`cdk/mmt/lib/mmt-shared-api-gateway-resources.ts`, `mmt-functions.ts`) — the
  S3-backed handlers now live under a `/staged` tree:
  - `createStagedConcept` — `PUT /staged/{conceptType}` (`stagingApiKeyAuthorizer`)
  - `getStagedConcept` — `GET /staged/{conceptType}/{recordId}` (`edlAuthorizer`)
  - `deleteStagedConcept` — `DELETE /staged/{conceptType}/{recordId}` (`edlAuthorizer`)

  The `/providers/{providerId}/{conceptType}/{nativeId}` resources are gone;
  `/providers/{providerId}/{conceptType}` survives only as the parent of the
  stage-for-production action. `/staged/{conceptType}` carries only the machine-to-machine
  PUT, so it gets no CORS `OPTIONS`.
- **`stageConceptForProduction`** — `POST /providers/{providerId}/{conceptType}/stage-for-production`
  (drops `{nativeId}`). It still reads `providerId` from the path for the per-user
  `fetchProviders` check, but no longer forwards it: it `PUT`s the body to
  `${STAGING_TARGET_API_HOST}/staged/${conceptType}`, reads the `recordId` from the target's
  response, and returns only
  `{ stagedConceptLink: \`${STAGING_TARGET_MMT_HOST}/${conceptType}/staged/${recordId}\` }` —
  `conceptType` and `recordId` are not echoed back separately.
- **Handlers** — `getStagedConcept` / `deleteStagedConcept` drop the `fetchProviders`
  import and the per-user provider-permission block; they are EDL-authenticated but no
  longer provider-scoped (any authenticated MMT user may read/delete any staged concept).
  `getStagedConcept` returns `{ concept, conceptType, recordId }`.
  `createStagedConcept` returns only `{ recordId }` (no `conceptType` — the caller
  already knows it, it's in the request path).
- **`createStagedConcept` in-handler `Staging-Api-Key` check removed** — it was
  redundant with the `stagingApiKeyAuthorizer` (which does the same comparison at API
  Gateway). The handler now does no auth; `STAGING_SECRET_API_KEY` is no longer injected into its
  Lambda (only into the authorizer's), and the `stagingApiKey` prop was dropped from
  `MmtFunctionsProps`. Consequence: the route is unauthenticated when run via
  `bin/api.mjs` locally, the same as every other local route.
- **Tests** — the removed provider-authz / `fetchProviders`-error cases are dropped from
  the `getStagedConcept` / `deleteStagedConcept` suites; `stageConceptForProduction`
  keeps its 403 / 500 provider cases (path now `{ providerId, conceptType }`).
- **Local helper scripts removed** — `scripts/localStagingConceptsTesting/` is gone; run
  the routes manually against the local API (see "Running locally" below).

## Running locally

1. `npm run start:fast` (builds + synths the CDK template, then boots the local API on
   `http://localhost:4001` via `bin/api.mjs`) and `npm run s3:start` for local S3.
2. `IS_OFFLINE=true` and the `bin/api.mjs` offline defaults cover auth locally: the EDL
   authorizer is bypassed, and `fetchProviders` accepts the test-mode token
   `Authorization: Bearer ABC-1` (grants `MMT_1` / `MMT_2`). The offline concepts bucket
   name is hard-coded (`mmt-staging-concepts-bucket-local`).
3. Seed a concept (the `bin/api.mjs` local runner does not invoke authorizers, so no
   `Staging-Api-Key` header is needed locally):
   `curl -X PUT localhost:4001/dev/staged/collections -H 'Content-Type: application/json' -d '{"ShortName":"Test","Version":"1"}'`
   → `{ "recordId": "<uuid>" }`.
4. `GET localhost:4001/dev/staged/collections/<uuid>` and
   `DELETE localhost:4001/dev/staged/collections/<uuid>` (send `Authorization: Bearer ABC-1`).
5. Stage-for-production loopback — set `STAGING_TARGET_API_HOST=http://localhost:4001/dev`,
   `STAGING_TARGET_MMT_HOST=http://localhost:5173`,
   `STAGING_TARGET_SECRET_API_KEY=local-staging-api-key` in the API process's environment,
   then
   `curl -X POST localhost:4001/dev/providers/MMT_1/collections/stage-for-production -H 'Authorization: Bearer ABC-1' -H 'Content-Type: application/json' -d '{"ShortName":"Test","Version":"1"}'`
   → `{ stagedConceptLink }`.

## Verification run

- `vitest run serverless/` → 30 files, 132 tests pass.
- `cdk synth` (`STAGE_NAME=dev`) → clean; template assertions confirmed (bucket
  lifecycle; `PUT /staged/{conceptType}` → `StagingApiKeyAuthorizer`; the staged
  `GET`/`DELETE` `{recordId}` routes and `POST /providers/{providerId}/{conceptType}/stage-for-production`
  → `EdlAuthorizer`; no `{nativeId}` resources remain; `templates`/`users` untouched).
- `eslint` on changed serverless files → clean; `tsc` build of `cdk/mmt` → clean.
- Verified end-to-end against the local API + S3: seed via `PUT /staged/{conceptType}`,
  get, delete, and the full stage-for-production loopback (returns a valid `stagedConceptLink`).

## Deploy prerequisites (not code)

- A forwarding environment's Bamboo plan (e.g. UAT, for UAT → Production) defines
  `bamboo_STAGING_TARGET_API_HOST`, `bamboo_STAGING_TARGET_MMT_HOST`,
  `bamboo_STAGING_TARGET_API_KEY` (secret). Non-forwarding plans leave them undefined —
  `deploy-bamboo.sh` defaults them to empty. The forwarding plan's
  `bamboo_STAGING_TARGET_API_KEY` must equal the target plan's `bamboo_STAGING_API_KEY`
  (same shared secret, two names).
- Networking: the forwarding Lambda (in-VPC) must be able to reach the target's private API
  Gateway — likely needs infra work (PrivateLink / VPC peering / a regional endpoint) when
  the target is a different account.
- If `mmt-<stage>-staging-concepts` was pre-created manually, `cdk import` or delete it
  before the first deploy.
