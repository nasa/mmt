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
  const { mmtHost } = getApplicationConfig()

  const params = new URLSearchParams(body)

  const launchpadToken = getLaunchpadToken(Cookie)

  const samlResponse = parseSaml(params.get('SAMLResponse'))
  const path = params.get('RelayState')

  const { auid, email } = samlResponse

  const location = `${mmtHost}/auth_callback?target=${path}`

  return {
    statusCode: 303,
    headers: {
      'Set-Cookie': [
        `token=${launchpadToken}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`,
        `auid=${auid}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`,
        `name=${auid}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`,
        `email=${email}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`
      ],
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Credentials': true,
      Location: location
    }
  }
}

export default samlCallback
