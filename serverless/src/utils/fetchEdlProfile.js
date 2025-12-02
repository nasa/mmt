import { getEdlConfig } from '../../../sharedUtils/getConfig'

/**
 * Returns the user's EDL profile based on the access token provided
 * @param {Object|string} token - Either an oauthToken object or an accessToken string
 */
const fetchEdlProfile = async (token) => {
  if (token === 'ABC-1') {
    return {
      auid: 'admin',
      name: 'Admin User',
      uid: 'admin'
    }
  }

  const { host } = getEdlConfig()

  // Determine the access token based on the input type
  let accessToken
  if (typeof token === 'string') {
    accessToken = token
  } else if (token && token.token && token.token.access_token) {
    accessToken = token.token.access_token
  } else {
    throw new Error('Invalid token provided')
  }

  return fetch(`${host}/oauth/userInfo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    })
    .then((profile) => {
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
        uid: profile.uid,
        assuranceLevel: profile.assurance_level
      }
    })
    .catch((error) => {
      console.error('fetchEdlProfile Error: ', error)
      throw error // Re-throw the error instead of returning undefined
    })
}

export default fetchEdlProfile
