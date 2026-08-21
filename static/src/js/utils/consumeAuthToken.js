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
 * Moves the user's token out of the URL an dinto a host-only cookie.
 *
 * `edlCallback` runs on the API host, which sits on a different domain than the application.
 * Any cookie it set would have to be scoped to a domain shared by every environment, so it
 * hands the token back in the URL fragment instead and the application stores it. Framents
 * are never sent to a server and never appeare in a `Referer` header, and the fragment is
 * cleared as soon as it has been read so the token does not sit in the address bar or browser
 * history.
 *
 * Runs before the app renders so the cookie is in place the first time `useMMTCookie` reads it.
 */

const consumeAuthToken = () => {
  const { hash } = window.location

  if (!hash) return

  const token = new URLSearchParams(hash.slice(1)).get('token')

  if (!token) return

  document.cookie = [
    `${MMT_COOKIE}=${token}`,
    ...serializeCookieOptions(getMMTCookieOptions(token))
  ].join('; ')

  // Drop the fragment, leaving the path and query string untouched
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}

export default consumeAuthToken
