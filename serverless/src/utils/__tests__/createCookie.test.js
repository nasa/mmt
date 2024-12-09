import createCookie from '../createCookie'

describe('createCookie', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      COOKIE_DOMAIN: '.example.com',
      JWT_VALID_TIME: '900'
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when not running locally', () => {
    test('returns the cookie string', () => {
      expect(createCookie('mock-jwt')).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900; Secure;')
    })
  })

  describe('when running locally', () => {
    test('returns the cookie string', () => {
      process.env.IS_OFFLINE = true

      expect(createCookie('mock-jwt')).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900;')
    })
  })
})
