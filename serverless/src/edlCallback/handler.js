import { AuthorizationCode } from 'simple-oauth2'
import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlProfile from '../utils/fetchEdlProfile'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'
import checkNonNasaMMTAccess from '../utils/checkNonNasaMMTAccess'

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
    expiresAt = token.expires_at

    edlProfile = await fetchEdlProfile(oauthToken)

    // Convert assuranceLevel to number if it's not already
    const assuranceLevel = Number(edlProfile.assuranceLevel)

    if (Number.isNaN(assuranceLevel) || assuranceLevel < 4) {
      return {
        statusCode: 303,
        headers: {
          Location: `${mmtHost}/unauthorizedMMTAccess`
        }
      }
    }

    if (assuranceLevel === 4) {
      try {
        const hasNonNasaDraftAccess = await checkNonNasaMMTAccess(edlProfile.uid, accessToken)
        if (!hasNonNasaDraftAccess) {
          return {
            statusCode: 303,
            headers: {
              Location: `${mmtHost}/unauthorizedNonNasaMMTAccess`
            }
          }
        }
      } catch (error) {
        console.error('Error checking Non-NASA MMT access:', error)
        throw error
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
