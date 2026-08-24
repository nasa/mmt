import jwt from 'jsonwebtoken'

/**
 * Returns the options MMT uses whenever it writes the auth cookie.
 *
 * `domain` is deliberately omitted so the browser stores a host-only cookie,
 * scopes to the exact host serving MMT.
 * @param {String} token The MMT JWT being stored, used to expire the cookie alongside the token
 */
const getMMTCookieOptions = (token) => {
  const options = {
    path: '/',
    sameSite: 'strict',
    secure: window.location.protocol === 'https:'
  }

  const decodedToken = jwt.decode(token)

  if (decodedToken?.exp) {
    options.expires = new Date(decodedToken.exp * 1000)
  }

  return options
}

export default getMMTCookieOptions
