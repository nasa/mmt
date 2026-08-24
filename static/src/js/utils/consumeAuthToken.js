import MMT_COOKIE from 'sharedConstants/mmtCookie'

import getMMTCookieOptions from './getMMTCookieOptions'

/**
 * Serializes cookie options into the attributes `document.cookie` expects.
 *
 * 'react-cookie' does this elsewhere, but this function runs before React.
 * @param {Object} options Options from `getMMTCookieOptions`
 */
const serializeCookieOptions = ({
  domain,
  expires,
  path,
  sameSite,
  secure
}) => {
  const attributes = []

  if (path) attributes.push(`Path=${path}`)
  if (domain) attributes.push(`Domain=${domain}`)
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
 * 'window.mmtAuthHeader' before any other script runs. See
 * 'edlCallback' for why.
 */

const consumeAuthToken = () => {
  const token = window.mmtAuthToken

  if (!token) return

  delete window.mmtAuthToken

  document.cookie = [
    `${MMT_COOKIE}=${token}`,
    ...serializeCookieOptions(getMMTCookieOptions(token))
  ].join('; ')
}

export default consumeAuthToken
