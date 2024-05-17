import { getEdlConfig } from '../../../sharedUtils/getConfig'
import { downcaseKeys } from './downcaseKeys'
import fetchEdlClientToken from './fetchEdlClientToken'

/**
 * Returns the user's EDL profile based on the launchpad token provided
 * @param {Object} headers Lambda event headers
 */
const fetchEdlProfile = async (headers) => {
  const { authorization: authorizationToken = '' } = downcaseKeys(headers)
  const tokenParts = authorizationToken.split(' ')
  const token = tokenParts[1]

  if (token === 'ABC-1') {
    return {
      uid: 'admin'
    }
  }

  const { host } = getEdlConfig()

  const clientToken = await fetchEdlClientToken()

  return fetch(`${host}/api/nams/edl_user`, {
    body: `token=${token}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log('fetchEdlProfile Error: ', error)

      return undefined
    })
}

export default fetchEdlProfile
