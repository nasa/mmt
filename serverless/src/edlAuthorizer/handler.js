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

  const { authorization: authorizationToken = '' } = downcaseKeys(headers)

  const [, token] = authorizationToken.split('Bearer ')
  const decodedJwt = jwt.verify(token, JWT_SECRET)
  const { launchpadToken } = decodedJwt

  const profile = await fetchEdlProfile(launchpadToken)
  const { uid } = profile

  if (uid) {
    return generatePolicy(uid, 'Allow', methodArn)
  }

  throw new Error('Unauthorized')
}

export default edlAuthorizer
