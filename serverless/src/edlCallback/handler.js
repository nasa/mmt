import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlProfile from '../utils/fetchEdlProfile'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'
import AuthorizationCode from '../utils/AuthorizationCode'

/**
 * Handles the EDL callback during authentication
 * @param {Object} event - Details about the HTTP request that it received
 * @param {Object} event.queryStringParameters - Query parameters from the EDL callback
 * @param {string} event.queryStringParameters.code - The authorization code from EDL
 * @param {string} event.queryStringParameters.state - The state parameter, containing the original target URL
 * @returns {Promise<Object>} - HTTP response object
 */
const edlCallback = async (event) => {
  const { code, state } = event.queryStringParameters
  const { target = '/' } = JSON.parse(decodeURIComponent(state))

  const { host: tokenHost, redirectUriPath } = getEdlConfig()
  const { apiHost, mmtHost } = getApplicationConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  let accessToken
  let refreshToken
  let expiresAt
  let edlProfile

  if (process.env.IS_OFFLINE) {
    // Development mode
    accessToken = 'ABC-1'
    refreshToken = 'ABC-1-refresh'
    expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
    edlProfile = await fetchEdlProfile(accessToken)
  } else {
    // Production mode
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
    accessToken = token.access_token
    refreshToken = token.refresh_token

    // Use JWT_VALID_TIME to override JWT expiration if set (for testing refresh logic)
    // If not set, use EDL's token expiration (default ~28 days)
    const { JWT_VALID_TIME } = process.env
    if (JWT_VALID_TIME) {
      const validTimeSeconds = parseInt(JWT_VALID_TIME, 10)
      expiresAt = new Date(Date.now() + validTimeSeconds * 1000).toISOString()
    } else {
      expiresAt = token.expires_at
    }

    edlProfile = await fetchEdlProfile(oauthToken)

    let { assuranceLevel } = edlProfile
    // Check if assuranceLevel is not already a number
    if (typeof assuranceLevel !== 'number') {
      assuranceLevel = Number(assuranceLevel)
    }

    // Define the minimum required assurance level
    const MINIMUM_ASSURANCE_LEVEL = 4

    // If assuranceLevel is undefined, not a valid number or a number smaller than MINIMUM_ASSURANCE_LEVEL
    // then show access denied error page
    if (!Number.isFinite(assuranceLevel) || assuranceLevel < MINIMUM_ASSURANCE_LEVEL) {
      console.error(`Invalid or insufficient assurance level: ${assuranceLevel}`)

      return {
        statusCode: 303,
        headers: {
          Location: `${mmtHost}/unauthorizedAccess?errorType=deniedAccessMMT`
        }
      }
    }
  }

  // Create JWT with EDL token and edl profile
  const jwt = createJwt(accessToken, refreshToken, expiresAt, edlProfile)

  const location = `${mmtHost}/auth-callback?target=${encodeURIComponent(target)}`

  const expiresAtInSeconds = Math.floor(new Date(expiresAt).getTime() / 1000)

  const response = {
    statusCode: 303,
    headers: {
      'Set-Cookie': createCookie(jwt, expiresAtInSeconds),
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
