import fetchEdlProfile from '../../../static/src/js/utils/fetchEdlProfile'
import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'

/**
 * Handles refreshing user's token
 * @param {Object} event Details about the HTTP request that it received
 */

const edlProfile = async (event) => {
  const { queryStringParameters } = event
  const { auid } = queryStringParameters
  const { defaultResponseHeaders } = getApplicationConfig()

  const getUserName = (profile) => {
    const firstName = profile.first_name
    const lastName = profile.last_name
    const name = firstName == null ? profile.uid : `${firstName} ${lastName}`

    return name
  }

  try {
    const profile = await fetchEdlProfile(auid)
    profile.auid = auid
    profile.name = getUserName(profile)

    delete profile.user_groups

    const returnValue = {
      headers: defaultResponseHeaders,
      statusCode: 200,
      body: JSON.stringify(profile)
    }

    return returnValue
  } catch (error) {
    console.error(`Error retrieving edl profile for ${auid}, error=${error.toString()}`)

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
