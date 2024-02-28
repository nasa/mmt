/**
 * Handles gkr requests for recommended keywords.
 * @param {Object} event Details about the HTTP request that it received
 */

import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'

const gkrRequest = async (event) => {
  const { gkrHost } = getApplicationConfig()
  const { body } = event
  const url = `${gkrHost}/api/requests/`

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  console.log(body)

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  })

  const gkrResponse = await response.json()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(gkrResponse)
  }
}

export default gkrRequest
