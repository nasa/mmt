/* eslint-disable no-restricted-syntax */
import { getApplicationConfig } from './getConfig'

/**
 * Calls errorLogger lambda /error-logger to log out any error
 * @param {Object} error An error object with the error message and stacktrace.
 * @param {string} action A string describing the action attempted.
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
