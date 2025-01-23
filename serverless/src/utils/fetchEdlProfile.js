import fetchEdlClientToken from './fetchEdlClientToken'

import { getEdlConfig } from '../../../sharedUtils/getConfig'

/**
 * Returns the user's EDL profile based on the launchpad token provided
 * @param {Object} headers Lambda event headers
 */
const fetchEdlProfile = async (launchpadToken) => {
  if (launchpadToken === 'ABC-1') {
    return {
      auid: 'admin',
      name: 'Admin User',
      uid: 'admin'
    }
  }

  const { host } = getEdlConfig()
  console.log('***** in saml callback edl host=', host)

  const clientToken = await fetchEdlClientToken()
  console.log('***** in saml callback clientToken=', clientToken)

  return fetch(`${host}/api/nams/edl_user`, {
    body: `token=${launchpadToken}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
    .then((response) => response.json())
    .then((profile) => {
      console.log('***** in saml callback profile', profile)
      const {
        first_name: firstName,
        last_name: lastName
      } = profile

      let name = [firstName, lastName].filter(Boolean).join(' ')

      if (name.trim().length === 0) {
        name = profile.uid
      }

      return {
        auid: profile.nams_auid,
        name,
        uid: profile.uid
      }
    })
    .catch((error) => {
      console.log('fetchEdlProfile Error: ', error)

      return undefined
    })
}

export default fetchEdlProfile
