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
  console.log('***** in saml callback')
  const { body, headers } = event
  const { Cookie: headerCookie } = headers
  const { mmtHost } = getApplicationConfig()
  console.log('***** in saml callback mmthost=', mmtHost)

  const params = new URLSearchParams(body)
  const path = params.get('RelayState')
  console.log('***** in saml callback path=', path)

  const launchpadToken = getLaunchpadToken(headerCookie)
  console.log('***** in saml callback token=', launchpadToken)

  const edlProfile = await fetchEdlProfile(launchpadToken)
  console.log('***** in saml callback profile=', edlProfile)

  // Create JWT with launchpad token and edl profile
  const jwt = createJwt(launchpadToken, edlProfile)
  console.log('***** in saml callback jwt=', jwt)

  const location = `${mmtHost}/auth-callback?target=${encodeURIComponent(path)}`
  console.log('***** in saml callback location=', location)

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
  console.log('***** in saml callback response=', response)

  return response
}

export default samlCallback
