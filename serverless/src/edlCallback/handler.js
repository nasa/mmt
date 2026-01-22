import { getApplicationConfig, getEdlConfig } from '../../../sharedUtils/getConfig'
import fetchEdlProfile from '../utils/fetchEdlProfile'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'

const edlCallback = async (event) => {
  const { code, state } = event.queryStringParameters || {}
  const { target = '/' } = state ? JSON.parse(decodeURIComponent(state)) : {}

  const { host: tokenHost, redirectUriPath } = getEdlConfig()
  const { apiHost, mmtHost } = getApplicationConfig()
  const redirectUri = `${apiHost}${redirectUriPath}`

  const clientId = process.env.EDL_CLIENT_ID
  const clientSecret = process.env.EDL_PASSWORD

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const tokenUrl = `${tokenHost}/oauth/token`

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`
      },
      body: body.toString()
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`)
    }

    const token = JSON.parse(responseText)
    const edlProfile = await fetchEdlProfile(token.access_token)

    // Create JWT with EDL token and edl profile
    const expiresAt = Math.floor(Date.now()) + token.expires_in
    console.log('Calculated expiresAt:', expiresAt)
    const jwt = createJwt(token.access_token, token.refresh_token, expiresAt, edlProfile)

    const location = `${mmtHost}/auth-callback?target=${encodeURIComponent(target)}`

    const responseHeaders = {
      statusCode: 303,
      headers: {
        'Set-Cookie': createCookie(jwt, expiresAt),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Credentials': true,
        Location: location
      }
    }

    return responseHeaders
  } catch (error) {
    console.error('Authentication Error:', error.message)
    console.error('Error Stack:', error.stack)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Authentication failed',
        details: error.message
      })
    }
  }
}

export default edlCallback
