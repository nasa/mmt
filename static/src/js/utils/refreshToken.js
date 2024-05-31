import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls refreshToken lambda to request a new token since the current one is about to expire. The new token is set as the MMT cookie
 * @param {Object} params
 * @param {String} params.jwt The user's MMT JWT
 * @param {Function} params.setToken Function to update the token
 */
const refreshToken = async ({
  jwt,
  setToken
}) => {
  const { apiHost } = getApplicationConfig()

  const options = {
    credentials: 'include',
    headers: {
      Authorization: jwt
    },
    method: 'POST'
  }

  await fetch(`${apiHost}/saml-refresh-token`, (options)).then((response) => {
    // If the refresh token failed, log out the user
    if (!response.ok) {
      setToken(null)

      window.location.href = '/'
    }
  })
}

export default refreshToken
