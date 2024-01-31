import { stringify } from 'querystring'
import { createJwtToken } from '../../../static/src/js/utils/createJwtToken'
import { getApplicationConfig, getSamlConfig } from '../../../static/src/js/utils/getConfig'

const Saml2js = require('saml2js')
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

  const parser = new Saml2js(params.get('SAMLResponse'))
  const path = params.get('RelayState')
  const samlResponse = parser.toObject()

  const jwtToken = createJwtToken(samlResponse)
  const queryParams = { jwt: jwtToken }
  queryParams.jwt = jwtToken

  const location = `${mmtHost}/auth_callback?target=${path}&jwt=${stringify(queryParams)}`

  return {
    statusCode: 303,
    headers: {
      'Set-Cookie': `token=${launchpadToken}; SameSite=None; Secure`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Credentials': true,
      Chris: 'Test',
      Location: location
    }
  }
}

export default samlCallback
