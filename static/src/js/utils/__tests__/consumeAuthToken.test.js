import jwt from 'jsonwebtoken'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

import consumeAuthToken from '../consumeAuthToken'

const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=')

    document.cookie = `${name.trim()}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`
  })
}

const setLocation = ({ hash = '', pathname = '/auth-callback', search = '' }) => {
  delete window.location
  window.location = {
    hash,
    pathname,
    protocol: 'http:',
    search
  }
}

const buildToken = () => jwt.sign(
  // Always keep the expiration sometime in the future
  { exp: Math.floor(Date.now() / 1000) + 900 },
  'mock-secret'
)

describe('consumeAuthToken', () => {
  let replaceStateSpy

  beforeEach(() => {
    clearCookies()
    setLocation({})
    replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the login redirect includes a token', () => {
    test('stores the token in a cookie', () => {
      const token = buildToken()
      setLocation({ hash: `#token=${encodeURIComponent(token)}` })

      consumeAuthToken()

      expect(document.cookie).toContain(`${MMT_COOKIE}=${token}`)
    })

    test('removes the token from the url, keeping the query string', () => {
      setLocation({
        hash: `#token=${encodeURIComponent(buildToken())}`,
        search: '?target=%2Fdrafts'
      })

      consumeAuthToken()

      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/auth-callback?target=%2Fdrafts')
    })

    test('writes the cookie with the options from getMMTCookieOptions', () => {
      const cookieSpy = vi.spyOn(document, 'cookie', 'set')
      setLocation({ hash: `#token=${encodeURIComponent(buildToken())}` })

      consumeAuthToken()

      const [written] = cookieSpy.mock.calls.at(-1)

      expect(written).toContain('Path=/')
      expect(written).toContain('Expires=')
      expect(written).toContain('SameSite=strict')

      expect(written).not.toContain('Domain=')

      expect(written).not.toContain('Secure')
    })
  })

  describe('when there is no token in the url', () => {
    test('leaves the url alone', () => {
      consumeAuthToken()

      expect(replaceStateSpy).not.toHaveBeenCalled()
    })

    test('does not write a cookie', () => {
      consumeAuthToken()

      expect(document.cookie).not.toContain(MMT_COOKIE)
    })
  })

  describe('when the fragment holds something other than a token', () => {
    test('leaves the url alone', () => {
      setLocation({ hash: '#section-two' })

      consumeAuthToken()

      expect(replaceStateSpy).not.toHaveBeenCalled()
    })
  })
})
