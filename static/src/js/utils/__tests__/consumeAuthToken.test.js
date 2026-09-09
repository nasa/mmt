import jwt from 'jsonwebtoken'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

import consumeAuthToken from '../consumeAuthToken'

const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=')

    document.cookie = `${name.trim()}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`
  })
}

const buildToken = () => jwt.sign(
  // Always keep the expiration sometime in the future
  { exp: Math.floor(Date.now() / 1000) + 900 },
  'mock-secret'
)

describe('consumeAuthToken', () => {
  beforeEach(() => {
    clearCookies()
    delete window.mmtAuthToken

    delete window.location
    window.location = { protocol: 'http:' }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the inline script captured a token', () => {
    test('stores the token in a cookie', () => {
      const token = buildToken()
      window.mmtAuthToken = token

      consumeAuthToken()

      expect(document.cookie).toContain(`${MMT_COOKIE}=${token}`)
    })

    test('takes the token back off the window once it is stored', () => {
      const token = buildToken()
      window.mmtAuthToken = token

      consumeAuthToken()

      expect(window.mmtAuthToken).toBeUndefined()
    })

    test('writes the cookie with the options from getMMTCookieOptions', () => {
      const cookieSpy = vi.spyOn(document, 'cookie', 'set')
      window.mmtAuthToken = buildToken()

      consumeAuthToken()

      const [written] = cookieSpy.mock.calls.at(-1)

      expect(written).toContain('Path=/')
      expect(written).toContain('Expires=')
      expect(written).toContain('SameSite=strict')

      expect(written).not.toContain('Domain=')

      expect(written).not.toContain('Secure')
    })
  })

  describe('when the captured token carries cookie attributes of its own', () => {
    const craftedToken = 'crafted; Domain=nasa.gov'

    test('does not let the token widen the cookie past this host', () => {
      const cookieSpy = vi.spyOn(document, 'cookie', 'set')
      window.mmtAuthToken = craftedToken

      consumeAuthToken()

      const [written] = cookieSpy.mock.calls.at(-1)

      expect(written).not.toContain('Domain=')
    })

    test('keeps the whole value inside the cookie', () => {
      window.mmtAuthToken = craftedToken

      consumeAuthToken()

      expect(document.cookie).toContain(`${MMT_COOKIE}=${encodeURIComponent(craftedToken)}`)
    })
  })

  describe('when no token was captured', () => {
    test('does not write a cookie', () => {
      window.mmtAuthToken = ''

      consumeAuthToken()

      expect(document.cookie).not.toContain(MMT_COOKIE)
    })
  })
})
