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
      Authorization: `Bearer ${jwt}`
    },
    method: 'POST'
  }

  try {
    const response = await fetch(`${apiHost}/edl-refresh-token`, (options))

    // If the refresh token failed, log out the user
    if (!response.ok) {
      console.error('[Auth] Token refresh failed:', response.status, response.statusText)
      setToken(null)
      window.location.href = '/'

      return
    }

    // Success - the new token is set as a cookie, signal success
    console.log('[Auth] Token refresh request successful')
    setToken('refresh_success')
  } catch (error) {
    console.error('[Auth] Token refresh request error:', error)
    setToken(null)
    window.location.href = '/'
  }
}

export default refreshToken
