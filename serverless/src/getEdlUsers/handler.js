import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlClientToken from '../utils/fetchEdlClientToken'

let clientToken

/**
 * Search EDL for users
 * @param {Object} event Details about the HTTP request that it received
 */
const getEdlUsers = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { host } = getEdlConfig()

  if (clientToken == null) {
    clientToken = await fetchEdlClientToken()
  }

  const { queryStringParameters } = event
  const { query } = queryStringParameters
  const url = `${host}/api/users?search=${query}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${clientToken}`
      }
    })

    const json = await response.json()

    const formattedValues = json.users.map((user) => ({
      id: user.uid,
      label: `${user.first_name} ${user.last_name}`
    }))

    return {
      body: JSON.stringify(formattedValues),
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getEdlUsers Error:', error)

    clientToken = null

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getEdlUsers
