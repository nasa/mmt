import encodeCookie from '../../../static/src/js/utils/encodeCookie'
import { getApplicationConfig, getSamlConfig } from '../../../static/src/js/utils/getConfig'
import fetchEdlProfile from '../../../static/src/js/utils/fetchEdlProfile'
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

const getUserName = async (auid) => {
  const edlProfile = await fetchEdlProfile(auid)
  const firstName = edlProfile.first_name
  const lastName = edlProfile.last_name
  const name = firstName == null ? edlProfile.uid : `${firstName} ${lastName}`

  return name
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
  const name = await getUserName(auid)

  const encodedCookie = encodeCookie({
    ...samlResponse,
    name,
    token: launchpadToken
  })

  let setCookie = `data=${encodedCookie}; Secure; Path=/; Domain=.earthdatacloud.nasa.gov`

  if (version === 'development') {
    setCookie = `data=${encodedCookie}; Path=/`
  }

  const location = `${mmtHost}/auth_callback?target=${path}`

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
