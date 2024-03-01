import fetchEdlProfile from '../../../static/src/js/utils/fetchEdlProfile'

/**
 * Handles refreshing user's token
 * @param {Object} event Details about the HTTP request that it received
 */

const edlProfile = async (event) => {
  const { queryStringParameters } = event
  const { auid } = queryStringParameters

  const getUserName = (profile) => {
    const firstName = profile.first_name
    const lastName = profile.last_name
    const name = firstName == null ? profile.uid : `${firstName} ${lastName}`

    return name
  }

  const profile = await fetchEdlProfile(auid)
  profile.auid = auid
  profile.name = getUserName(profile)

  delete profile.user_groups

  const returnValue = {
    statusCode: 200,
    body: JSON.stringify(profile)
  }

  return returnValue
}

export default edlProfile
