/**
 * Handles gkr requests for sending feedback regarding recommended keywords
 * in order to better train the machine learning model.
 * See https://gkr.sit.earthdatacloud.nasa.gov/docs/ for JSON values passed in body
 * @param {Object} event Details about the HTTP request that it received
 */

import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'

const gkrSendFeedback = async (event) => {
  const { gkrHost } = getApplicationConfig()
  const { body } = event
  const { queryStringParameters } = event
  const { uuid } = queryStringParameters
  const { defaultResponseHeaders } = getApplicationConfig()

  const url = `${gkrHost}/api/requests/${uuid}`

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body
    })

    const gkrResponse = await response.json()

    return {
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(gkrResponse)
    }
  } catch (error) {
    console.error(`Error sending gkr feedback, request=${JSON.stringify(body)} error=${error.toString()}`)

    return {
      headers: defaultResponseHeaders,
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString()
      })
    }
  }
}

export default gkrSendFeedback
