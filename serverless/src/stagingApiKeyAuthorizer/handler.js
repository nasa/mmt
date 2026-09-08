import { generatePolicy } from '../utils/authorizer/generatePolicy'
import { downcaseKeys } from '../utils/downcaseKeys'
import { safeCompareSecret } from '../utils/safeCompareSecret'

/**
 * Custom API Gateway authorizer for the machine-to-machine "staging concepts"
 * endpoints. It authenticates the caller solely by a shared secret sent in the
 * `Staging-Api-Key` header (compared against `process.env.STAGING_API_KEY`).
 *
 * This replaces the EDL authorizer on the concept routes: those requests come
 * from the MMT UAT forwarding Lambda, not from a browser user with an EDL token.
 * @param {Object} event Details about the HTTP request that it received
 */
const stagingApiKeyAuthorizer = async (event) => {
  const { headers = {}, methodArn } = event

  // Allow local development invocations to bypass auth. The local API runner
  // (bin/api.mjs) never invokes authorizers, so this only matters if the
  // authorizer handler is exercised directly.
  if (process.env.IS_OFFLINE) {
    return generatePolicy('offline', 'Allow', methodArn)
  }

  const { 'staging-api-key': stagingApiKey } = downcaseKeys(headers)

  // Fail closed when the expected key is not configured in the environment.
  if (!safeCompareSecret(stagingApiKey, process.env.STAGING_API_KEY)) {
    console.error('Missing or invalid Staging-Api-Key header')

    throw new Error('Unauthorized')
  }

  return generatePolicy('staging-api-client', 'Allow', methodArn)
}

export default stagingApiKeyAuthorizer
