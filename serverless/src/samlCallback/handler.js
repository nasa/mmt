import encodeCookie from '../../../static/src/js/utils/encodeCookie'
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
  const samlResponse = parseSaml(params.get('SAMLResponse'))
  const path = params.get('RelayState')

  const { auid } = samlResponse
  const launchpadToken = getLaunchpadToken(Cookie)

  const encodedCookie = encodeCookie({
    ...samlResponse,
    name: auid,
    token: launchpadToken
  })

  let setCookie = `data=${encodedCookie}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`

  if (version === 'development') {
    setCookie = `data=${encodedCookie}; Path=/`
  }

  const location = `${mmtHost}/auth_callback?target=${encodeURIComponent(path)}`

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
