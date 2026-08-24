import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls refreshToken lambda to request a new token since the current one is about to expire.
 * @param {Object} params
 * @param {String} params.jwt The user's MMT JWT
 * @param {Function} params.setToken Called with the refreshed JWT, or `null` when the refresh failed
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

    const { token } = await response.json()

    // A 200 without a token is still a failed refresh. Passit on would store
    // an empty cookie and log the user out without sending them anywhere.
    if (!token) {
      console.error('[Auth] Token refresh returned no token')
      setToken(token)
      window.location.href = '/'

      return
    }

    // Success - hand the refreshed token back so the caller can store it
    setToken(token)
  } catch (error) {
    console.error('[Auth] Token refresh request error:', error)
    setToken(null)
    window.location.href = '/'
  }
}

export default refreshToken
