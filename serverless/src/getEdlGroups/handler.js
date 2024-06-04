import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlClientToken from '../utils/fetchEdlClientToken'

let clientToken

/**
 * Search EDL for groups
 * @param {Object} event Details about the HTTP request that it received
 */
const getEdlGroups = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { host } = getEdlConfig()

  if (clientToken == null) {
    clientToken = await fetchEdlClientToken()
  }

  const { queryStringParameters } = event
  const { query, tags } = queryStringParameters
  const url = `${host}/api/user_groups/search?&name=${query}&tags=${tags},CMR`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${clientToken}`
      }
    })

    const json = await response.json()

    const formattedValues = json.map((item) => ({
      id: item.group_id,
      name: item.name,
      tag: item.tag
    }))

    return {
      body: JSON.stringify(formattedValues),
      headers: defaultResponseHeaders
    }
  } catch (error) {
    console.log('getEdlGroups Error:', error)

    clientToken = null

    return {
      statusCode: 404,
      headers: defaultResponseHeaders
    }
  }
}

export default getEdlGroups
