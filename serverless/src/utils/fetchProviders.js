import jwt from 'jsonwebtoken'
import fetchEdlProfile from './fetchEdlProfile'
import { downcaseKeys } from './downcaseKeys'
import { getEdlConfig } from '../../../sharedUtils/getConfig'

/**
 * Returns the user's EDL profile based on the event provided
 * @param {Object} event Details about the HTTP request that it received
 */
const fetchProviders = async (event) => {
  const { env } = process
  const { JWT_SECRET } = env

  const { headers = {} } = event
  const { authorization: authorizationToken = '' } = downcaseKeys(headers)
  const [, token] = authorizationToken.split('Bearer ')

  // If we are in test mode
  if (token === 'ABC-1') {
    return ['MMT_1', 'MMT_2']
  }

  // To run locally need to use decode instead of verify since we wont have the JWT_SECRET
  let decodedJwt
  if (env.IS_OFFLINE) {
    decodedJwt = jwt.decode(token)
  } else {
    decodedJwt = jwt.verify(token, JWT_SECRET)
  }

  const { edlToken } = decodedJwt

  const profile = await fetchEdlProfile(edlToken)
  const { uid } = profile

  const { host } = getEdlConfig()

  const response = await fetch(`${host}/api/user_groups/groups_for_user/${uid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${edlToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(data)}`)
  }

  // eslint-disable-next-line camelcase
  const { user_groups } = data
  // eslint-disable-next-line camelcase
  const providerIds = user_groups.map(
    (group) => group.tag
  )

  return providerIds
}

export default fetchProviders
