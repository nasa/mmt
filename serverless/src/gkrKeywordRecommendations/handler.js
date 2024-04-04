/**
 * Handles gkr requests for recommended keywords.
 * See https://gkr.sit.earthdatacloud.nasa.gov/docs/ for JSON values passed in body
 * @param {Object} event Details about the HTTP request that it received
 */

import { getApplicationConfig } from '../../../sharedUtils/getConfig'

const gkrKeywordRecommendations = async (event) => {
  const { gkrHost } = getApplicationConfig()
  const { body } = event
  const url = `${gkrHost}/api/requests/`
  const { defaultResponseHeaders } = getApplicationConfig()

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    })

    const gkrResponse = await response.json()

    return {
      headers: defaultResponseHeaders,
      statusCode: 200,
      body: JSON.stringify(gkrResponse)
    }
  } catch (error) {
    console.error(`Error retrieving gkr recommended keywords, request=${JSON.stringify(body)} error=${error.toString()}`)

    return {
      headers: defaultResponseHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString()
      })
    }
  }
}

export default gkrKeywordRecommendations
