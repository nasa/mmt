import { getApplicationConfig, getSamlConfig } from '../../../static/src/js/utils/getConfig'
import parseSaml from '../../../static/src/js/utils/parseSaml'

const { URLSearchParams } = require('url')
const cookie = require('cookie')

/**
 * Pulls the launchpad token out of the cookie header
 * @param {*} cookieString
 * @returns the launchpad token
 */
const getLaunchpadToken = (cookieString) => {
  const { version } = getApplicationConfig()
  if (version === 'development') {
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
  const { Cookie } = headers
  const { mmtHost, version } = getApplicationConfig()

  const params = new URLSearchParams(body)
  const path = params.get('RelayState')

  const launchpadToken = getLaunchpadToken(Cookie)
  const samlResponse = parseSaml(params.get('SAMLResponse'))
  const { auid } = samlResponse

  // There appears to be a limitation in AWS to only allow sending 1 cookie, so we are sending
  // 1 cookie with multiple values in a base 64 encoded json string.
  let setCookie = `launchpadToken=${launchpadToken}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov; Max-Age=2147483647`

  if (version === 'development') {
    setCookie = `launchpadToken=${launchpadToken}; Path=/`
  }

  const location = `${mmtHost}/auth_callback?target=${encodeURIComponent(path)}&auid=${encodeURIComponent(auid)}`

  const response = {
    statusCode: 303,
    headers: {
      'Set-Cookie': setCookie,
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
