import jwt from 'jsonwebtoken'
import { getEdlConfig, getApplicationConfig } from '../../../sharedUtils/getConfig'
import createJwt from '../utils/createJwt'
import createCookie from '../utils/createCookie'
import { downcaseKeys } from '../utils/downcaseKeys'

const edlRefreshToken = async (event) => {
  console.log('Entering edlRefreshToken function')

  const { JWT_SECRET } = process.env
  const { mmtHost } = getApplicationConfig()
  const { host: tokenHost } = getEdlConfig()

  console.log(`Token host: ${tokenHost}`)

  const { headers } = event
  const { authorization: jwtToken = '' } = downcaseKeys(headers)

  console.log('Received JWT token: ', jwtToken)

  try {
    // Decode the JWT to get the current EDL profile and refresh token
    const decodedJwt = jwt.verify(jwtToken, JWT_SECRET)
    console.log('Decoded JWT:', JSON.stringify(decodedJwt, null, 2))

    const { edlProfile, refreshToken: oldRefreshToken } = decodedJwt
    console.log(`Refresh token extracted: ${oldRefreshToken.substring(0, 20)}...`)

    // Use environment variables for client ID and secret
    const clientId = process.env.EDL_CLIENT_ID
    const clientSecret = process.env.EDL_PASSWORD

    if (!clientId || !clientSecret) {
      console.error('EDL_CLIENT_ID or EDL_PASSWORD environment variable is not set')
      throw new Error('EDL client credentials are not properly configured')
    }

    const tokenUrl = `${tokenHost}/oauth/token`
    console.log(`Token URL: ${tokenUrl}`)

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: oldRefreshToken
    }).toString()

    console.log('Request body (partially masked):', body.replace(/refresh_token=[^&]+/, 'refresh_token=XXXXX'))

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

    console.log('Response status:', response.status)

    const responseBody = await response.text()
    console.log('Response body:', responseBody)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`)
    }

    const newToken = JSON.parse(responseBody)
    console.log('New token received')

    const {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn
    } = newToken

    console.log(`New access token: ${newAccessToken.substring(0, 20)}...`)
    console.log(`New refresh token: ${newRefreshToken ? `${newRefreshToken.substring(0, 20)}...` : 'Not provided'}`)
    console.log(`Expires in: ${expiresIn} seconds`)

    // Calculate expires_at
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // Convert expires_at to local time and log it
    const expiresAtLocal = new Date(expiresAt).toLocaleString()
    console.log(`New token expires at: ${expiresAtLocal} (local time)`)

    // Create a new JWT with the new access token, refresh token, and existing EDL profile
    const newJwt = createJwt(newAccessToken, newRefreshToken, expiresAt, edlProfile)
    console.log('New JWT created')

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': createCookie(newJwt),
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
  } finally {
    console.log('Exiting edlRefreshToken function')
  }
}

export default edlRefreshToken
