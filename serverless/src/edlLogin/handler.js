import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'

/**
 * Redirects the user to the correct EDL login URL
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlLogin = async (event) => {
  const { target = '/', app } = event.queryStringParameters || {}

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

  // Encode the target and app into the state parameter
  const state = encodeURIComponent(JSON.stringify({
    target,
    app
  }))

  const location = new URL(`${edlHost}/oauth/authorize`)
  location.searchParams.append('response_type', 'code')
  location.searchParams.append('client_id', clientId)
  location.searchParams.append('redirect_uri', redirectUri)
  location.searchParams.append('state', state)

  return {
    statusCode: 307,
    headers: {
      Location: location.toString()
    }
  }
}

export default edlLogin
