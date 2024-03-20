import isTokenExpired from './isTokenExpired'
import refreshToken from './refreshToken'

/**
 * Checks the specified token to see if it is expired.  If it is expired,
 * it will invoke lambda to retrieve a new token and call the provided
 * setUser function to update the token.
 * @param {*} token the token currently being  used
 * @param {*} user the user object
 * @param {*} callback the callback handler called when it gets a new refresh token.
 */
const checkAndRefreshToken = async (user, callback) => {
  const { token } = user
  const { tokenValue, tokenExp } = token || {}

  if (tokenValue && tokenExp) {
    // Subtract 1 minute from the actual token expiration to decide if we should refresh
    const offsetTokenInfo = { ...token }
    offsetTokenInfo.tokenExp -= 60 * 1000 // Shorten it by 1 minute
    if (isTokenExpired(offsetTokenInfo)) {
      const newToken = await refreshToken(tokenValue)

      callback(newToken)
    }
  }
}

export default checkAndRefreshToken
