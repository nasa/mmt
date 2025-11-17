import { AuthorizationCode } from 'simple-oauth2'
import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlProfile from '../utils/fetchEdlProfile'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'

/**
 * Fetches an EDL token based on the 'code' param supplied by EDL. Sets a cookie containing a JWT containing the EDL token
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const edlCallback = async (event) => {
  const { code, state } = event.queryStringParameters
  const { target = '/' } = JSON.parse(decodeURIComponent(state))

  const { host: tokenHost, redirectUriPath } = getEdlConfig()
  const { apiHost, mmtHost } = getApplicationConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  // Use environment variables for client ID and secret
  const clientId = process.env.EDL_CLIENT_ID
  const clientSecret = process.env.EDL_PASSWORD

  if (!clientId || !clientSecret) {
    console.error('EDL_CLIENT_ID or EDL_PASSWORD environment variable is not set')
    throw new Error('EDL client credentials are not properly configured')
  }

  const config = {
    client: {
      id: clientId,
      secret: clientSecret
    },
    auth: {
      tokenHost,
      authorizePath: '/oauth/authorize',
      tokenPath: '/oauth/token'
    }
  }

  const client = new AuthorizationCode(config)

  const tokenConfig = {
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  }

  const oauthToken = await client.getToken(tokenConfig)

  if (!oauthToken) {
    throw new Error('Failed to obtain OAuth token')
  }

  const { token } = oauthToken
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt
  } = token

  // Log token details
  console.log('OAuth Token received:')
  console.log('Access Token:', accessToken)
  console.log('Refresh Token:', refreshToken)
  console.log('Expires At:', expiresAt)

  // Convert expires_at to local time and log it
  const expiresAtLocal = new Date(expiresAt).toLocaleString()
  console.log(`Token expires at: ${expiresAtLocal} (local time)`)

  const edlProfile = await fetchEdlProfile(oauthToken)

  // Create JWT with EDL token and edl profile
  const jwt = createJwt(accessToken, refreshToken, expiresAt, edlProfile)

  const location = `${mmtHost}/auth-callback?target=${encodeURIComponent(target)}`

  const response = {
    statusCode: 303,
    headers: {
      'Set-Cookie': createCookie(jwt),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Credentials': true,
      Location: location
    }
  }

  return response
}

export default edlCallback
