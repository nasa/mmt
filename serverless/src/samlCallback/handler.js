import cookie from 'cookie'

import createCookie from '../utils/createCookie'
import createJwt from '../utils/createJwt'
import fetchEdlProfile from '../utils/fetchEdlProfile'

import { getApplicationConfig, getSamlConfig } from '../../../sharedUtils/getConfig'

/**
 * Pulls the launchpad token out of the cookie header
 * @param {String} cookieString
 * @returns the launchpad token
 */
const getLaunchpadToken = (cookieString) => {
  if (process.env.IS_OFFLINE) {
    return 'ABC-1'
  }

  const cookies = cookie.parse(cookieString)

  return cookies[getSamlConfig().cookieName]
}

/**
 * Handles saml callback during authentication
 * @param {Object} event Details about the HTTP request that it received
 */
const samlCallback = async (event) => {
  const { body, headers } = event
  const { Cookie: headerCookie } = headers
  const { mmtHost } = getApplicationConfig()

  const params = new URLSearchParams(body)
  const path = params.get('RelayState')

  const launchpadToken = getLaunchpadToken(headerCookie)

  const edlProfile = await fetchEdlProfile(launchpadToken)

  // Create JWT with launchpad token and edl profile
  const jwt = createJwt(launchpadToken, edlProfile)

  const location = `${mmtHost}/auth-callback?target=${encodeURIComponent(path)}`

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

export default samlCallback
