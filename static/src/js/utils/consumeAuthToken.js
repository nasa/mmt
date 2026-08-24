import MMT_COOKIE from 'sharedConstants/mmtCookie'

import getMMTCookieOptions from './getMMTCookieOptions'

/**
 * Serializes cookie options into the attributes `document.cookie` expects.
 *
 * `AuthContextProvider` hands teh same options to `react-cookie`, which does
 * this for us. This runs before React, so it writes the cookie directy.
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
 * edlCallback runs on the API host, which sits on a different domain than the
 * application. Any cookie it set would have to be scoped to a domain shared by
 * every environment and would then be sent on requests to all of them. So it
 * returns the token in the URL fragment instead and the application sotes it,
 * which keeps the cookie scoped to this host alone.
 *
 * The fragment is lifted out of the URL by an inline script in index.html,
 * which runs before any other script on the page and left on window.mmtAuthoken.
 * Reading it here rather than from window.location keeps that orderining
 * guarantee in one place.
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
