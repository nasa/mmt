import { generatePolicy } from '../utils/authorizer/generatePolicy'
import { downcaseKeys } from '../utils/downcaseKeys'

// Temporary tracing for MMT-4195 (tracking down the "staging target rejected
// with status 403" issue). Paired with the same marker/correlationId logged
// by stageConceptForProduction (source) and createStagedConcept (target), so
// a single request can be followed across both environments' log groups in
// Splunk. Never logs the actual key values -- only whether they were present
// and their lengths, which is enough to catch a trailing-whitespace/newline
// mismatch without exposing the secret. Safe to delete once MMT-4195 is resolved.
const DEBUG_MARKER = '[MMT-4195-STAGE-DEBUG]'

/**
 * Custom API Gateway authorizer for the machine-to-machine `createStagedConcept`
 * route (`PUT /staged/{conceptType}`). It authenticates the caller solely by a shared
 * secret sent in the `Staging-Api-Key` header (compared against
 * `process.env.STAGING_SECRET_API_KEY`).
 *
 * That route is called server-to-server by another environment's
 * `stageConceptForProduction` forwarding Lambda, not by a browser user with an EDL token,
 * so it uses this authorizer instead of the EDL one.
 * @param {Object} event Details about the HTTP request that it received
 */
const stagingApiKeyAuthorizer = async (event) => {
  const { headers = {}, methodArn } = event

  const { 'x-mmt-debug-correlation-id': correlationId } = downcaseKeys(headers)

  // Logged unconditionally, before any auth check, so its mere presence (or
  // absence) in Splunk for a given correlationId tells us whether the request
  // reached this Lambda at all -- vs. being blocked earlier at the network/
  // resource-policy layer, which would look identical to a key mismatch from
  // the source side's point of view.
  console.log(`${DEBUG_MARKER} target-authorizer: invoked correlationId=${correlationId}`)

  // Allow local development invocations to bypass auth. The local API runner
  // (bin/api.mjs) never invokes authorizers, so this only matters if the
  // authorizer handler is exercised directly.
  if (process.env.IS_OFFLINE) {
    return generatePolicy('offline', 'Allow', methodArn)
  }

  const { 'staging-api-key': stagingApiKey } = downcaseKeys(headers)
  const expectedApiKey = process.env.STAGING_SECRET_API_KEY

  // Fail closed when the expected key is not configured in the environment.
  if (!expectedApiKey || stagingApiKey !== expectedApiKey) {
    console.error(`${DEBUG_MARKER} target-authorizer: DENY correlationId=${correlationId} hasIncomingKey=${!!stagingApiKey} incomingKeyLength=${stagingApiKey?.length ?? 0} hasExpectedKey=${!!expectedApiKey} expectedKeyLength=${expectedApiKey?.length ?? 0}`)
    console.error('Missing or invalid Staging-Api-Key header')

    throw new Error('Unauthorized')
  }

  console.log(`${DEBUG_MARKER} target-authorizer: ALLOW correlationId=${correlationId}`)

  return generatePolicy('staging-api-client', 'Allow', methodArn)
}

export default stagingApiKeyAuthorizer
