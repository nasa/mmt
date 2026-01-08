import jwt from 'jsonwebtoken'
import { getEdlConfig, getApplicationConfig } from '../../../sharedUtils/getConfig'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'
import { downcaseKeys } from '../utils/downcaseKeys'

/**
 * Refreshes an existing EDL session by exchanging the refresh token embedded in the
 * caller's JWT for a new access/refresh token pair, then returning an updated cookie.
 *
 * @param {Object} event Lambda invocation event containing the HTTP request.
 * @param {Object} event.headers Request headers; must include `Authorization` with the MMT JWT.
 * @returns {Promise<{statusCode:number, headers:Object, body?:string}>} HTTP response compatible with API Gateway.
 */
const edlRefreshToken = async (event) => {
  const { JWT_SECRET, IS_OFFLINE } = process.env
  const { mmtHost } = getApplicationConfig()
  const { host: tokenHost } = getEdlConfig()

  const { headers } = event
  const { authorization: jwtToken = '' } = downcaseKeys(headers)

  try {
    // Decode the JWT to get the current EDL profile and refresh token
    const [, token] = jwtToken.split('Bearer ')
    const decodedJwt = jwt.verify(token, JWT_SECRET)

    const { edlProfile, refreshToken: oldRefreshToken } = decodedJwt

    let newAccessToken; let newRefreshToken; let
      expiresAt

    if (IS_OFFLINE) {
      // Development mode
      newAccessToken = 'ABC-1'
      newRefreshToken = 'ABC-1-refresh'
      expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
    } else {
      // Production mode

      const clientId = process.env.EDL_CLIENT_ID
      const clientSecret = process.env.EDL_PASSWORD

      if (!clientId || !clientSecret) {
        console.error('EDL_CLIENT_ID or EDL_PASSWORD environment variable is not set')
        throw new Error('EDL client credentials are not properly configured')
      }

      const tokenUrl = `${tokenHost}/oauth/token`

      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: oldRefreshToken
      }).toString()

      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${auth}`
        },
        body
      })

      const responseBody = await response.text()

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`)
      }

      const newToken = JSON.parse(responseBody)

      newAccessToken = newToken.access_token
      newRefreshToken = newToken.refresh_token

      // Use JWT_VALID_TIME to override JWT expiration if set (for testing refresh logic)
      // If not set, use EDL's token expiration (default ~28 days)
      const { JWT_VALID_TIME } = process.env
      if (JWT_VALID_TIME) {
        const validTimeSeconds = parseInt(JWT_VALID_TIME, 10)
        expiresAt = new Date(Date.now() + validTimeSeconds * 1000).toISOString()
      } else {
        const expiresIn = newToken.expires_in
        expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()
      }
    }

    // Create a new JWT with the new access token, refresh token, and existing EDL profile
    const newJwt = createJwt(newAccessToken, newRefreshToken, expiresAt, edlProfile)

    const expiresAtInSeconds = Math.floor(new Date(expiresAt).getTime() / 1000)

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': createCookie(newJwt, expiresAtInSeconds),
        'Access-Control-Allow-Origin': mmtHost,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true
      }
    }
  } catch (error) {
    console.error('Token refresh error:', error.message)
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': mmtHost,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Failed to refresh token',
        details: error.message
      })
    }
  }
}

export default edlRefreshToken
