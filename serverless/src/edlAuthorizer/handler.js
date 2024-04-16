import { generatePolicy } from '../utils/authorizer/generatePolicy'
import fetchEdlProfile from '../utils/fetchEdlProfile'

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event) => {
  const {
    headers = {},
    methodArn
  } = event

  const profile = await fetchEdlProfile(headers)
  const { uid } = profile

  if (uid) {
    return generatePolicy(uid, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlAuthorizer
