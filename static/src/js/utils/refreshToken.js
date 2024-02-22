import { getApplicationConfig } from './getConfig'

/**
 * Calls refreshToken lambda to request a new token since the current one is about to expire
 * @param {Object} token The users existing launchpad token
 */
const refreshToken = async (token) => {
  const { apiHost, version } = getApplicationConfig()

  if (version === 'development') {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    return {
      tokenValue: 'ABC-1',
      tokenExp: expires.valueOf()
    }
  }

  const options = {
    method: 'POST',
    headers: {
      token
    }
  }

  return fetch(`${apiHost}/saml-refresh-token`, (options)).then((response) => {
    const expires = response.headers.get('expires') * 1000
    const refreshTokenValue = {
      tokenValue: response.headers.get('token'),
      tokenExp: expires
    }

    return refreshTokenValue
  })
}

export default refreshToken
