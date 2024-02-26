import { getEdlConfig } from './getConfig'
import fetchEdlClientToken from './fetchEdlClientToken'

const fetchEdlProfile = async (auid) => {
  const { host } = getEdlConfig()
  const clientToken = await fetchEdlClientToken()
  const response = await fetch(`${host}/api/users/user_by_nams_auid/${auid}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clientToken}`
    }
  })

  const profile = await response.json()

  return profile
}

export default fetchEdlProfile
