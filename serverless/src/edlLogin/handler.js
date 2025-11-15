import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'

/**
 * Redirects the user to the correct EDL login URL
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlLogin = async (event) => {
  const { target } = event.queryStringParameters || {}

  // Get the EDL configuration
  const edlConfig = await getEdlConfig()

  const {
    host: edlHost,
    redirectUriPath
  } = edlConfig

  // Use the environment variable for the client ID
  const clientId = process.env.EDL_CLIENT_ID

  if (!clientId) {
    console.error('EDL_CLIENT_ID environment variable is not set')
    throw new Error('EDL client ID is not configured')
  }

  const { apiHost } = getApplicationConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  // Encode the target into the state parameter
  const state = encodeURIComponent(JSON.stringify({ target }))

  const location = `${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  return {
    statusCode: 307,
    headers: {
      Location: location
    }
  }
}

export default edlLogin
