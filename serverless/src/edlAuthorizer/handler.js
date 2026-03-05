import jwt from 'jsonwebtoken'
import { generatePolicy } from '../utils/authorizer/generatePolicy'
import { downcaseKeys } from '../utils/downcaseKeys'
import fetchEdlProfile from '../utils/fetchEdlProfile'

/**
 * Custom authorizer for API Gateway authentication
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlAuthorizer = async (event) => {
  const { env } = process
  const { JWT_SECRET } = env

  const {
    headers = {},
    methodArn
  } = event

  // Allow local development invocations to bypass auth.
  if (process.env.IS_OFFLINE) {
    return generatePolicy('mock_user', 'Allow', methodArn)
  }

  const { authorization: authorizationToken = '' } = downcaseKeys(headers)

  const [, token] = authorizationToken.split('Bearer ')
  const decodedJwt = jwt.verify(token, JWT_SECRET)
  const { edlToken } = decodedJwt

  const profile = await fetchEdlProfile(edlToken)
  const { uid } = profile

  if (uid) {
    return generatePolicy(uid, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlAuthorizer
