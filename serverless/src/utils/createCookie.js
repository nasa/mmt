import MMT_COOKIE from 'sharedConstants/mmtCookie'

/**
 * Returns the cookie string with the provided JWT
 * @param {String} jwt JWT to use for the cookie value
 * @param {Number} tokenExpirationTime Expiration time of the token in seconds since Unix epoch
 */
const createCookie = (jwt, tokenExpirationTime) => {
  const {
    COOKIE_DOMAIN,
    IS_OFFLINE
  } = process.env

  // Calculate Max-Age in seconds
  const now = Math.floor(Date.now() / 1000) // Current time in seconds
  const maxAge = Math.max(tokenExpirationTime - now, 0) // Ensure it's not negative

  let cookie = `${MMT_COOKIE}=${jwt}; SameSite=Strict; Path=/; Domain=${COOKIE_DOMAIN}; Max-Age=${maxAge};`
  if (!IS_OFFLINE) {
    cookie += ' Secure;'
  }

  return cookie
}

export default createCookie
