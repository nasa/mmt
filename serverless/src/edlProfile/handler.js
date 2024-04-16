import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import fetchEdlProfile from '../utils/fetchEdlProfile'

/**
 * Retrieves the EDL profile from a user's launchpad token
 * @param {Object} event Details about the HTTP request that it received
 */
const edlProfile = async (event) => {
  const { headers } = event
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    const profile = await fetchEdlProfile(headers)

    const firstName = profile.first_name
    const lastName = profile.last_name
    const name = [firstName, lastName].filter(Boolean).join(' ')

    profile.name = name
    profile.auid = profile.nams_auid

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
