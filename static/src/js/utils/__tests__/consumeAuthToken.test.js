import jwt from 'jsonwebtoken'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

import consumeAuthToken from '../consumeAuthToken'

const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=')

    document.cookie = `${name.trim()}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`
  })
}

const buildToken = (overrides = {}) => jwt.sign(
  {
    edlToken: 'mock-edl-token',
    refreshToken: 'mock-refresh-token',
    edlProfile: { uid: 'mock-user' },
    // Always keep the expiration sometime in the future
    exp: Math.floor(Date.now() / 1000) + 900,
    ...overrides
  },
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

  describe('when the captured value is not an MMT Tokencons', () => {
    test('does not store a value carrying cookie attributes of its own', () => {
      window.mmtAuthToken = 'crafted; Domain=nasa.gov'

      consumeAuthToken()

      expect(document.cookie).not.toContain(MMT_COOKIE)
    })

    test('does not store a token that is missing MMT attributes', () => {
      window.mmtAuthToken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 900 },
        'mock-secret'
      )

      consumeAuthToken()

      expect(document.cookie).not.toContain(MMT_COOKIE)
    })

    test('does not store an expired token', () => {
      window.mmtAuthToken = buildToken({ exp: Math.floor(Date.now() / 1000) - 60 })

      consumeAuthToken()

      expect(document.cookie).not.toContain(MMT_COOKIE)
    })

    test('takes the rejected value back off the window', () => {
      window.mmtAuthToken = 'crafted; Domain=nasa.gov'

      consumeAuthToken()

      expect(window.mmtAuthToken).toBeUndefined()
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
