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
  console.log('🚀 ~ samlCallback ~ headers:', headers)
  console.log('🚀 ~ samlCallback ~ body:', body)

  const { Cookie } = headers
  console.log('🚀 ~ samlCallback ~ Cookie:', Cookie)

  const { mmtHost } = getApplicationConfig()
  console.log('🚀 ~ samlCallback ~ mmtHost:', mmtHost)

  const params = new URLSearchParams(body)
  console.log('🚀 ~ samlCallback ~ params:', params)

  const launchpadToken = getLaunchpadToken(Cookie)
  console.log('🚀 ~ samlCallback ~ launchpadToken:', launchpadToken)

  const samlResponse = parseSaml(params.get('SAMLResponse'))
  console.log('🚀 ~ samlCallback ~ samlResponse:', samlResponse)
  const path = params.get('RelayState')
  console.log('🚀 ~ samlCallback ~ path:', path)

  const { auid, email } = samlResponse
  console.log('🚀 ~ samlCallback ~ email:', email)
  console.log('🚀 ~ samlCallback ~ auid:', auid)

  const location = `${mmtHost}/auth_callback?target=${path}`

  console.log('🚀 ~ samlCallback ~ location:', location)
  const response = {
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
  console.log('🚀 ~ samlCallback ~ response:', response)

  return response
}

export default samlCallback
