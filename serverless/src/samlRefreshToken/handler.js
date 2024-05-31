import jwt from 'jsonwebtoken'
import cookie from 'cookie'

import createCookie from '../utils/createCookie'
import createJwt from '../utils/createJwt'

import { getSamlConfig } from '../../../sharedUtils/getConfig'
import { downcaseKeys } from '../utils/downcaseKeys'

/**
 * Retrieves the launchpad token from the given headers
 * @param {Object} headers the headers are coming from the keep alive response.
 */
const findLaunchpadTokenInHeaders = (headers) => {
  const setCookie = headers.getSetCookie()
  let launchpadToken = null

  setCookie.forEach((cookieString) => {
    const cookies = cookie.parse(cookieString)
    const cookieValue = cookies[getSamlConfig().cookieName]

    if (cookieValue != null) {
      launchpadToken = cookieValue
    }
  })

  return launchpadToken
}

/**
 * Handles refreshing user's token
 * @param {Object} event Details about the HTTP request that it received
 */
const samlRefreshToken = async (event) => {
  const { IS_OFFLINE, JWT_SECRET } = process.env

  const { headers } = event
  const { authorization: token = '' } = downcaseKeys(headers)

  // Decode the JWT to get the current launchpad token
  const decodedJwt = jwt.verify(token, JWT_SECRET)
  const {
    edlProfile,
    launchpadToken: oldToken
  } = decodedJwt

  // If running offline, return the existing token with a new JWT
  if (IS_OFFLINE) {
    const newJwt = createJwt(oldToken, edlProfile)

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': createCookie(newJwt),
        'Access-Control-Expose-Headers': 'token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Credentials': true
      }
    }
  }

  const options = getSamlConfig()
  const { launchpadRoot, cookieName, keepAliveOrigin } = options
  const path = '/icam/api/pub/sm/v1/keepalive'
  const fetchUrl = `${launchpadRoot}${path}`

  // Call the keep alive endpoint to get a new token
  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      Origin: keepAliveOrigin,
      cookie: `${cookieName}=${oldToken}`
    }
  })

  const json = await response.json()

  if (json.status === 'success') {
    const launchpadToken = findLaunchpadTokenInHeaders(response.headers)

    // Create a new JWT with the new launchpadToken and existing edlProfile
    const newJwt = createJwt(launchpadToken, edlProfile)

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': createCookie(newJwt),
        'Access-Control-Expose-Headers': 'token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Credentials': true
      }
    }
  }

  console.log(`Error refreshing launchpad token: ${json.message}`)

  return {
    'Access-Control-Expose-Headers': 'message',
    statusCode: 500,
    headers: {
      message: json.message
    }
  }
}

export default samlRefreshToken
