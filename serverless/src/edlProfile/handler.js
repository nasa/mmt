import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { downcaseKeys } from '../utils/downcaseKeys'
import fetchEdlProfile from '../utils/fetchEdlProfile'

/**
 * Retrieves the EDL profile from a user's launchpad token
 * @param {Object} event Details about the HTTP request that it received
 */
const edlProfile = async (event) => {
  const { headers } = event
  const { authorization: authorizationToken = '' } = downcaseKeys(headers)
  const tokenParts = authorizationToken.split(' ')
  const token = tokenParts[1]

  const { defaultResponseHeaders } = getApplicationConfig()

  const getUserName = (profile) => {
    const firstName = profile.first_name
    const lastName = profile.last_name
    const name = firstName == null ? profile.uid : `${firstName} ${lastName}`

    return name
  }

  try {
    const profile = await fetchEdlProfile(token)

    profile.auid = profile.nams_auid
    profile.name = getUserName(profile)

    delete profile.user_groups

    return {
      headers: defaultResponseHeaders,
      statusCode: 200,
      body: JSON.stringify(profile)
    }
  } catch (error) {
    console.error(`Error retrieving EDL profile, error=${error.toString()}`)

    return {
      headers: defaultResponseHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString()
      })
    }
  }
}

export default edlProfile
