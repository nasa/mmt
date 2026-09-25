import MMT_COOKIE from 'sharedConstants/mmtCookie'

import getMMTCookieOptions from './getMMTCookieOptions'
import hasValidMMTTokenShape from './hasValidMMTTokenShape'

/**
 * Serializes cookie options into the attributes `document.cookie` expects.
 *
 * 'react-cookie' does this elsewhere, but this function runs before React.
 * @param {Object} options Options from `getMMTCookieOptions`
 */
const serializeCookieOptions = ({
  expires,
  path,
  sameSite,
  secure
}) => {
  const attributes = []

  if (path) attributes.push(`Path=${path}`)
  if (expires) attributes.push(`Expires=${expires.toUTCString()}`)
  if (sameSite) attributes.push(`SameSite=${sameSite}`)
  if (secure) attributes.push('Secure')

  return attributes
}

/**
 * Stores the token from the login redirect in a host-only cookie.
 *
 * The token arrives in the URL fragment rather than a 'Set-Cookie'
 * header and an inline script in 'index.html' moves it to
 * 'window.mmtAuthToken' before any other script runs. See
 * 'edlCallback' for why.
 */
const consumeAuthToken = () => {
  const token = window.mmtAuthToken

  // Delete regardless of whether or not it's a valid token
  delete window.mmtAuthToken

  if (!hasValidMMTTokenShape(token)) return

  // Encoded so a cookie cannot carry its own cookie attributes.
  document.cookie = [
    `${MMT_COOKIE}=${encodeURIComponent(token)}`,
    ...serializeCookieOptions(getMMTCookieOptions(token))
  ].join('; ')
}

export default consumeAuthToken
