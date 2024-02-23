import { getSamlConfig } from '../../../static/src/js/utils/getConfig'

const cookieParser = require('cookie')

/**
 * Retrieves the launchpad token from the given headers
 * @param {*} headers the headers are coming from the keep alive response.
 */
const findLaunchpadTokenInHeaders = (headers) => {
  const setCookie = headers.getSetCookie()
  let launchpadToken = null
  setCookie.forEach((cookieString) => {
    const cookies = cookieParser.parse(cookieString)
    const cookieValue = cookies[getSamlConfig().cookieName]
    if (cookieValue != null) {
      launchpadToken = cookieValue
    }
  })

  return launchpadToken
}

const getExpirationDate = () => {
  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  return expires
}
/**
 * Handles refreshing user's token
 * @param {Object} event Details about the HTTP request that it received
 */

const samlRefreshToken = async (event) => {
  const { headers } = event
  const { token } = headers

  const options = getSamlConfig()
  const { launchpadRoot, cookieName, keepAliveOrigin } = options
  const path = '/icam/api/pub/sm/v1/keepalive'
  const fetchUrl = `${launchpadRoot}${path}`

  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      Origin: keepAliveOrigin,
      cookie: `${cookieName}=${token}`
    }
  })
  const json = await response.json()
  const expires = getExpirationDate()

  const launchpadToken = findLaunchpadTokenInHeaders(response.headers)
  if (json.status === 'success') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Expose-Headers': 'token, expires',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Credentials': true,
        token: launchpadToken,
        expires: expires.valueOf() / 1000
      }
    }
  }

  return {
    'Access-Control-Expose-Headers': 'message',
    statusCode: 500,
    headers: {
      message: json.message
    }
  }
}

export default samlRefreshToken
