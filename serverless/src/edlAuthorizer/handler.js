import { generatePolicy } from '../utils/authorizer/generatePolicy'
import { downcaseKeys } from '../utils/downcaseKeys'
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

  const { authorization: authorizationToken = '' } = downcaseKeys(headers)

  // `authorizationToken` comes in as `Bearer asdf.qwer.hjkl` but we only need the actual token
  const tokenParts = authorizationToken.split(' ')
  const token = tokenParts[1]

  if (process.env.IS_OFFLINE && token === 'ABC-1') {
    return generatePolicy('user', token, 'Allow', methodArn)
  }

  const profile = await fetchEdlProfile()
  const { uid } = profile

  if (uid) {
    return generatePolicy(uid, token, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlAuthorizer
