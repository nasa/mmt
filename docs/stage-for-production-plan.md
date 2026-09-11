# Stage-for-Production: cross-environment concept staging

> **Amendment (Part 4 — see [stage-for-production-changes.md](./stage-for-production-changes.md)):**
> the `providerId / conceptType / nativeId` tuple was dropped. A staged concept is now
> identified only by a generated `recordId`; the S3 key is `{conceptType}/{recordId}`; the
> S3-backed routes moved under `/staged/{conceptType}[/{recordId}]` and their per-user
> `fetchProviders` check was removed. The **list endpoint (`getConcepts`) was removed
> entirely** — there is no `GET /staged/{conceptType}`. `stageConceptForProduction` stays
> on `POST /providers/{providerId}/{conceptType}/stage-for-production` (no `{nativeId}`),
> keeps its provider check, and on success returns only `{ stagedConceptLink }` (no
> `conceptType` / `recordId` in the body; `productionUrl` was renamed to
> `stagedConceptLink`). The
> remaining handlers and their directories were renamed to carry the word `Staged`
> (`getStagedConcept`, `createOrUpdateStagedConcept`, `deleteStagedConcept`), and
> `createOrUpdateStagedConcept` was renamed again to `createStagedConcept` (every `PUT`
> generates a new `recordId`, so it never updates an existing record). The
> `createStagedConcept` in-handler `Staging-Api-Key` check (Part 1e) was **removed**
> as redundant with `stagingApiKeyAuthorizer`. The `PRODUCTION_*` forwarding env vars were
> renamed to `STAGING_TARGET_*` and made **optional** in `deploy-bamboo.sh`
> (`${bamboo_STAGING_TARGET_*:-}`) — only forwarding environments define them.
> `createStagedConcept` now returns only `{ recordId }` (no `conceptType` — the
> caller already has it, from the request path). The
> `scripts/localStagingConceptsTesting/` helper scripts
> (Part 3 below) were removed — see "Running locally" in the changes doc for the manual
> `curl` equivalents. Route strings, handler names, and payloads below reflect the original
> design.

## Context

The `MMT-4199` work on this branch added an S3-backed "staging concepts" store to MMT: four
Lambdas — `createOrUpdateConcept` (PUT), `deleteConcept` (DELETE), `getConcept` (GET),
`getConcepts` (GET list) — exposed on the MMT REST API Gateway under
`/providers/{providerId}/{conceptType}/{nativeId}`. Every route is currently guarded by three
layers: the EDL Lambda authorizer (`edlAuthorizer`, on the `Authorization` header), an in-handler
`Staging-Api-Key` header check against `process.env.STAGING_SECRET_API_KEY`, and an in-handler
`fetchProviders(event)` per-user provider-permission check. In practice these endpoints are only
callable by a caller holding both an EDL JWT and the staging key, so today only the local test
scripts exercise them. There is no frontend and no cross-environment path.

The new requirement is a **UAT → Production** promotion flow:

1. In **UAT** MMT, a user views a collection and clicks **"Stage for Production"** (a confirm
   modal is shown — frontend, out of scope here).
2. React POSTs the full collection metadata to a **new UAT Lambda** that holds the Production
   staging API key in an environment variable.
3. That UAT Lambda forwards the metadata to a **Production** concept Lambda on the Production API
   Gateway, authenticating with the Production staging API key.
4. The Production API Gateway runs a **new Lambda authorizer** that verifies the API key. On
   success the Production `createOrUpdateConcept` Lambda writes the metadata to the Production
   `mmt-prod-staging-concepts` S3 bucket.
5. Production returns the identifying `providerId/conceptType/nativeId` tuple; the UAT Lambda
   builds a Production deep link and returns it so React can offer the user a "continue in
   Production" link (opens in a new tab).

Intended outcome: `createOrUpdateConcept` becomes a **machine-to-machine endpoint** authenticated
by the staging API key (via a proper authorizer), and a new UAT Lambda fronts the cross-account
call so the Production key never reaches the browser. `getConcept` / `getConcepts` /
`deleteConcept` stay EDL-authenticated browser routes with their per-user provider check.

Decisions:
- **Scope:** backend + infrastructure only. No React changes (the endpoint contract is
  documented below for the frontend ticket).
- **Metadata source:** React sends the complete collection metadata JSON in the request body.
- **Authorizer:** API-key-only, but **only on `createOrUpdateConcept` (PUT)** — the single
  machine-to-machine route the UAT forwarding Lambda calls. The in-handler `fetchProviders`
  check is removed there (the UAT Lambda is trusted to have done user/provider authorization).
  `getConcept`, `getConcepts`, and `deleteConcept` stay behind `edlAuthorizer` and keep their
  in-handler `fetchProviders` per-user provider check — they are called directly by browser
  users (e.g. from the "Continue in Production" deep link), not cross-environment.
- **Returned identifier:** the `providerId/conceptType/nativeId` tuple (no new storage / UUID).
- **Retention:** the concepts S3 bucket gets a 30-day object-expiration lifecycle rule (staged
  concepts are transient promotion artifacts).

---

## Part 0 — Provision the concepts S3 bucket with 30-day retention

No CDK stack currently creates the `mmt-<stage>-staging-concepts` bucket — the Serverless→CDK
migration dropped bucket creation and the four handlers reference it by name only
(`serverless/src/utils/getConceptsBucketName.js` → `process.env.STAGING_CONCEPTS_BUCKET_NAME`).
Add an `s3.Bucket` to `cdk/mmt/lib/mmt-stack.ts`:

```ts
import * as s3 from 'aws-cdk-lib/aws-s3'

new s3.Bucket(this, 'StagingConceptsBucket', {
  bucketName: STAGING_CONCEPTS_BUCKET_NAME,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
  lifecycleRules: [{
    id: 'expire-staged-concepts',
    enabled: true,
    expiration: cdk.Duration.days(30)
  }]
})
```

- `RETAIN` removal policy so `cdk destroy` never deletes staged data.
- The existing `iamRoleCustomResourcesLambdaExecution` grants `s3:*` on `*`, so no extra IAM
  wiring is needed.
- **Pre-existing bucket:** MMT-4199 has not been deployed to a real environment, so the bucket
  should not exist yet. If it was manually pre-provisioned, delete it or `cdk import` it before
  the first deploy or the CloudFormation create fails with "bucket already exists".
- Local: `setup/startS3.js` keeps creating the bucket in s3rver; s3rver ignores lifecycle
  config so local objects don't expire (acceptable).

---

## Part 1 — Production side: new API-key authorizer + update the `createOrUpdateConcept` Lambda

### 1a. New authorizer handler — `serverless/src/stagingApiKeyAuthorizer/handler.js`

Model it on `serverless/src/edlAuthorizer/handler.js` and reuse
`serverless/src/utils/authorizer/generatePolicy.js` and `serverless/src/utils/downcaseKeys.js`.

- `type: REQUEST`, identity from the `Staging-Api-Key` header.
- If `process.env.IS_OFFLINE` → `return generatePolicy('offline', 'Allow', event.methodArn)`
  (mirrors the `edlAuthorizer` offline bypass; the local runner in `bin/api.mjs` never invokes
  authorizers anyway).
- Read the `staging-api-key` header case-insensitively via `downcaseKeys`.
- If `!process.env.STAGING_SECRET_API_KEY || key !== process.env.STAGING_SECRET_API_KEY` →
  `throw new Error('Unauthorized')` (API Gateway maps this to 401).
- Otherwise `return generatePolicy('staging-api-client', 'Allow', event.methodArn)`.
- New test file `serverless/src/stagingApiKeyAuthorizer/__tests__/handler.test.js` covering:
  offline bypass, valid key, wrong key, missing key, `STAGING_SECRET_API_KEY` unset (fail closed) —
  follow the env save/restore pattern in `serverless/src/edlAuthorizer/__tests__/handler.test.js`.

### 1b. CDK authorizer wiring — `cdk/mmt/lib/mmt-authorizers.ts`

Add a second authorizer next to `edlAuthorizer`, following the exact same construct shape
(dedicated `cdk.NestedStack`, `application.NodeJsFunction`, `lambda.CfnPermission`,
`apigateway.CfnAuthorizer`):

- `functionName: 'stagingApiKeyAuthorizer'`, entry
  `../../serverless/src/stagingApiKeyAuthorizer/handler.js`.
- `CfnAuthorizer`: `type: 'REQUEST'`,
  `identitySource: 'method.request.header.Staging-Api-Key'`,
  `authorizerResultTtlInSeconds: 0`, `name: 'stagingApiKeyAuthorizer'`.
- Expose `public readonly stagingApiKeyAuthorizer: apigateway.CfnAuthorizer`.

### 1c. Thread the new authorizer through props

- `cdk/mmt/lib/mmt-functions.ts`: widen `MmtFunctionsProps.authorizers` to
  `{ edlAuthorizer: apigateway.CfnAuthorizer; stagingApiKeyAuthorizer: apigateway.CfnAuthorizer }`.
- `cdk/mmt/lib/mmt-stack.ts`: pass
  `authorizers: { edlAuthorizer: authorizers.edlAuthorizer, stagingApiKeyAuthorizer: authorizers.stagingApiKeyAuthorizer }`.

### 1d. Swap the authorizer on the PUT concept route — `cdk/mmt/lib/mmt-functions.ts`

For `CreateOrUpdateConceptLambda` only, change `api.authorizer` from
`authorizers.edlAuthorizer` to `authorizers.stagingApiKeyAuthorizer`. Leave `edlAuthorizer`
on `GetConceptsLambda`, `GetConceptLambda`, `DeleteConceptLambda`, `users`, and all
`templates` routes.

### 1e. Update the concept handlers

- `serverless/src/createOrUpdateConcept/handler.js`:
  - **Remove** the `fetchProviders(event)` import and the provider-permission block (deletes
    the 401 "unauthorized provider" branch and the 500 `fetchProviders`-error branch).
  - **Keep** the in-handler `Staging-Api-Key` check exactly as-is. It is now redundant with the
    authorizer in deployed environments, but `bin/api.mjs` does not run authorizers, so it
    remains the only auth layer for local development. Add a one-line comment saying so.
  - On success, return the identifier tuple in the body so the caller can build a deep link:
    `return { statusCode, headers: defaultResponseHeaders, body: JSON.stringify({ providerId, conceptType, nativeId }) }`.
  - Note the resulting trust boundary in a comment: any holder of the staging key may now write
    to any `providerId`. This is acceptable because the key is held only by the UAT forwarding
    Lambda, which performs user/provider authorization before forwarding. (Optional future
    hardening: an `STAGING_CONCEPTS_ALLOWED_PROVIDERS` allow-list env var — not in this plan.)
  - Update `__tests__/handler.test.js`: drop the `fetchProviders` / "unauthorized provider" /
    error cases, and add a body assertion to the success test.
- `serverless/src/{getConcept,getConcepts,deleteConcept}/handler.js`: **no auth change** —
  keep `edlAuthorizer` + the in-handler `fetchProviders` per-user provider check and their
  existing test coverage. (These do not carry a `Staging-Api-Key` check.)

### 1f. Minor — `cdk/mmt/lib/mmt-stack.ts`

Add `'Staging-Api-Key'` to the `allowHeaders` array. The cross-environment call is
server-to-server (no browser CORS), but this keeps the header allowed if a browser ever calls
these routes and matches the intent of the header.

---

## Part 2 — UAT side: new forwarding Lambda

### 2a. Handler — `serverless/src/stageConceptForProduction/handler.js`

Route: `POST /providers/{providerId}/{conceptType}/{nativeId}/stage-for-production`, behind
`edlAuthorizer` (a real browser user with an EDL JWT). Pattern to follow:
`serverless/src/gkrKeywordRecommendations/handler.js` (read body → `fetch` external → relay
response), plus `fetchProviders` from `serverless/src/utils/fetchProviders.js`.

Logic:
1. `getApplicationConfig()` for `defaultResponseHeaders`.
2. `const { conceptType, nativeId, providerId } = event.pathParameters`.
3. Validate `conceptType` against `sharedConstants/s3ConceptTypes.js` → 400.
4. `const allowedProviderIds = await fetchProviders(event)`; if `providerId` not included → 403.
   (This is where per-user provider authorization now lives for the promotion flow.)
5. Require `event.body` → 400 if missing.
6. Read `process.env.STAGING_TARGET_API_HOST`, `process.env.STAGING_TARGET_SECRET_API_KEY`,
   `process.env.STAGING_TARGET_MMT_HOST`; if `STAGING_TARGET_API_HOST` or `STAGING_TARGET_SECRET_API_KEY`
   is unset → 500 (environment not configured for promotion).
7. `fetch(`${STAGING_TARGET_API_HOST}/providers/${providerId}/${conceptType}/${nativeId}`, {
   method: 'PUT',
   headers: { 'Staging-Api-Key': STAGING_TARGET_SECRET_API_KEY, 'Content-Type': 'application/json' },
   body: event.body })`.
8. If the Production response is not 2xx → return `{ statusCode: 502, body: JSON.stringify({ error }) }`
   so React can show a failure message.
9. On success return:
   `{ statusCode: 200, headers: defaultResponseHeaders, body: JSON.stringify({
       providerId, conceptType, nativeId,
       productionUrl: `${STAGING_TARGET_MMT_HOST}/providers/${providerId}/${conceptType}/${nativeId}` }) }`.
   (The exact Production review path is the frontend ticket's call — keep it a single template
   string here so it is easy to adjust.)
10. New test file `serverless/src/stageConceptForProduction/__tests__/handler.test.js` using the
    global `fetch` stub from `test-setup.js`: success, bad conceptType, missing body, provider
    not allowed, env not configured, Production returns non-2xx.

This Lambda touches no S3, so it uses the default `lambdaRole` — do **not** pass
`role: s3LambdaRole`.

### 2b. CDK — API Gateway resource + function

- `cdk/mmt/lib/mmt-shared-api-gateway-resources.ts`: add a child resource `stage-for-production`
  under `providersConceptTypeNativeIdResource`
  (logical id e.g. `ApiGatewayResourceProvidersProviderIdVarConceptTypeVarNativeIdVarStageForProduction`),
  expose it, and `addOptions('...StageForProduction', resource, ['POST'])`.
- `cdk/mmt/lib/mmt-functions.ts`: add `StageConceptForProductionLambda`
  (`application.NodeJsFunction` in its own `NestedStack`), method `POST`,
  `authorizer: authorizers.edlAuthorizer`, entry
  `../../serverless/src/stageConceptForProduction/handler.js`,
  `functionName: 'stageConceptForProduction'`,
  `parentPath: 'providersProviderIdVarConceptTypeVarNativeIdVar'`, `path: 'stage-for-production'`.

### 2c. CDK — environment variables — `cdk/mmt/lib/mmt-stack.ts`

Add to the `process.env` destructuring (with dev-safe defaults) and to the `environment` object
passed into `defaultLambdaConfig`:

- `STAGING_TARGET_API_HOST = ''`
- `STAGING_TARGET_SECRET_API_KEY = 'local-staging-api-key'`
- `STAGING_TARGET_MMT_HOST = ''`

These are only meaningfully set for the UAT deployment. In other environments they stay empty and
the forwarding Lambda returns 500 if invoked (expected — the button only exists in UAT).

### 2d. Deploy pipeline — `bin/deploy-bamboo.sh`

Add three `-e` lines to `dockerRun`:
`STAGING_TARGET_API_HOST=$bamboo_STAGING_TARGET_API_HOST`,
`STAGING_TARGET_SECRET_API_KEY=$bamboo_STAGING_TARGET_API_KEY`,
`STAGING_TARGET_MMT_HOST=$bamboo_STAGING_TARGET_MMT_HOST`.

Deployment notes (call out in the PR description):
- The **UAT** Bamboo plan must define `bamboo_STAGING_TARGET_API_HOST` (the Production API Gateway
  base URL incl. stage), `bamboo_STAGING_TARGET_API_KEY`, `bamboo_STAGING_TARGET_MMT_HOST`.
- The **Production** Bamboo plan's existing `bamboo_STAGING_API_KEY` must equal the UAT plan's
  `bamboo_STAGING_TARGET_API_KEY` (same shared secret, two names).
- The Production API Gateway is a PRIVATE REST API; confirm the UAT Lambda's VPC/subnets can
  reach the Production API Gateway's VPC endpoint (networking prerequisite — flag for infra
  team; may require a public/regional endpoint or VPC-peering/PrivateLink, outside this code
  change).

---

## Part 3 — Local testing

Originally implemented as helper scripts under `scripts/localStagingConceptsTesting/`. Those
scripts were later **removed** — see "Running locally" in
[stage-for-production-changes.md](./stage-for-production-changes.md) for the equivalent
manual `curl` steps (offline auth bypass, `Authorization: Bearer ABC-1`, and the
`STAGING_TARGET_*` loopback values).

---

## Frontend contract (for the separate React ticket — not implemented here)

- Request: `POST {apiHost}/providers/{providerId}/{conceptType}/stage-for-production`,
  `Authorization: Bearer <edlToken>`, body = full collection metadata JSON.
- Success response `200`: `{ stagedConceptLink }` only — render `stagedConceptLink` as a
  "Continue in Production" link (`target="_blank"`).
- Failure: non-2xx with `{ error }` — surface via `errorLogger` + a user-facing message.

---

## Verification

1. **Unit tests:** `npm test` — all `serverless/src` suites green, including the two new handler
   suites and the edited `createOrUpdateConcept` suite.
2. **CDK synth:** `npm run build:cdk:mmt && npm run run-synth`. Inspect
   `cdk/mmt/cdk.out/mmt-cdk-dev.template.json`:
   - a second `AWS::ApiGateway::Authorizer` named `stagingApiKeyAuthorizer` exists;
   - the `PUT` concept `AWS::ApiGateway::Method` has `AuthorizationType: CUSTOM` with
     `AuthorizerId` referencing `StagingApiKeyAuthorizer`;
   - the GET / GET-list / DELETE concept methods still reference `EdlAuthorizer`;
   - a `POST .../stage-for-production` method exists with the EDL authorizer;
   - `users` / `templates` methods still reference `edlAuthorizer`.
3. **S3 lifecycle:** confirm the synthesized template's `AWS::S3::Bucket` has a
   `LifecycleConfiguration` rule with `ExpirationInDays: 30` and `Status: Enabled`, and
   `DeletionPolicy: Retain`.
4. **Local end-to-end:** terminal A `npm run s3:start`, terminal B `npm run start:fast`, then
   run the manual `curl` steps in "Running locally"
   ([stage-for-production-changes.md](./stage-for-production-changes.md)) — seed a concept
   (`PUT /staged/{conceptType}`), `GET` / `DELETE` it by `recordId`, and exercise the
   stage-for-production loopback.
5. **Lint:** `npm run lint`.
