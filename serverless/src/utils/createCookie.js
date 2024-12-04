import MMT_COOKIE from '../../../sharedContstants/mmtCookie'

/**
 * Returns the cookie string with the provided JWT
 * @param {String} jwt JWT to use for the cookie value
 */
const createCookie = (jwt) => {
  const {
    COOKIE_DOMAIN,
    IS_OFFLINE,
    JWT_VALID_TIME
  } = process.env

  let cookie = `${MMT_COOKIE}=${jwt}; SameSite=Strict; Path=/; Domain=${COOKIE_DOMAIN}; Max-Age=${JWT_VALID_TIME};`
  if (!IS_OFFLINE) {
    cookie += ' Secure;'
  }

  return cookie
}

export default createCookie
