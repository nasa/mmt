/**
 * Handles gkr requests for sending feedback regarding recommended keywords 
 * in order to better train the machine learning model.
 * @param {Object} event Details about the HTTP request that it received
 */

import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'

const gkrSendFeedback = async (event) => {
  const { gkrHost } = getApplicationConfig()
  const { body } = event
  const { queryStringParameters } = event
  const { uuid } = queryStringParameters
  const url = `${gkrHost}/api/requests/${uuid}`

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  const response = await fetch(url, {
    method: 'PUT',
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

export default gkrSendFeedback
