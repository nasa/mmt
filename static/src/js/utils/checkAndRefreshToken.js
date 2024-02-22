import isTokenExpired from './isTokenExpired'
import refreshToken from './refreshToken'

/**
 * Checks the specified token to see if it is expired.  If it is expired,
 * it will invoke lambda to retrieve a new token and call the provided
 * setUser function to update the token.
 * @param {*} token the token currently being  used
 * @param {*} user the user object
 * @param {*} setUser the setUser function to be used to update the token
 */
const checkAndRefreshToken = async (token, user, setUser) => {
  const { tokenValue, tokenExp } = token || {}

  if (tokenValue && tokenExp) {
    console.log('time remaining ', new Date(tokenExp), new Date(), ((tokenExp.valueOf() - new Date().valueOf()) / 1000 / 60))

    // Subtract 1 minute from the actual token expiration to decide if we should refresh
    const offsetTokenInfo = { ...token }
    offsetTokenInfo.tokenExp -= 60 * 1000 // Shorten it by 1 minute

    if (isTokenExpired(offsetTokenInfo)) {
      const newToken = await refreshToken(tokenValue)
      console.log('new token is ', newToken)
      setUser({
        ...user,
        token: newToken
      })
    }
  }
}

export default checkAndRefreshToken
