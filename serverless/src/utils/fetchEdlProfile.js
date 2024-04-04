import { getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlClientToken from './fetchEdlClientToken'

/**
 * Returns the user's EDL profile based on the launchpad token provided
 * @param {String} launchpadToken User's launchpad token
 */
const fetchEdlProfile = async (launchpadToken) => {
  if (launchpadToken === 'ABC-1') {
    return {
      uid: 'mock_user'
    }
  }

  const { host } = getEdlConfig()

  const clientToken = await fetchEdlClientToken()

  return fetch(`${host}/api/nams/edl_user`, {
    body: `token=${launchpadToken}`,
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
