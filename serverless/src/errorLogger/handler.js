import { getApplicationConfig } from '../../../sharedUtils/getConfig'

/**
 * Logs an error reported by a client
 * @param {Object} event Details about the HTTP request that it received
 */
const errorLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const { body } = event
  const {
    message,
    stack,
    location,
    action
  } = JSON.parse(body)

  console.error('Error reported', `Action: ${action} - Message: ${message} - Location: ${location} - Stack: ${JSON.stringify(stack)}`)

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default errorLogger
