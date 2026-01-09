import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  vi
} from 'vitest'
import createCookie from '../createCookie'

describe('createCookie', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = {
      ...OLD_ENV,
      COOKIE_DOMAIN: '.example.com'
    }

    vi.spyOn(Date, 'now').mockImplementation(() => 1625097600000) // 2021-07-01T00:00:00.000Z
  })

  afterEach(() => {
    process.env = OLD_ENV
    vi.restoreAllMocks()
  })

  describe('when not running locally', () => {
    test('returns the cookie string with correct Max-Age', () => {
      const jwt = 'mock-jwt'
      const expiresAt = Math.floor(Date.now() / 1000) + 900 // 15 minutes from now

      const result = createCookie(jwt, expiresAt)
      expect(result).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900; Secure;')
    })
  })

  describe('when running locally', () => {
    test('returns the cookie string without Secure flag', () => {
      process.env.IS_OFFLINE = 'true'
      const jwt = 'mock-jwt'
      const expiresAt = Math.floor(Date.now() / 1000) + 900 // 15 minutes from now

      const result = createCookie(jwt, expiresAt)
      expect(result).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900;')
    })
  })

  test('handles expiration time in the past', () => {
    const jwt = 'mock-jwt'
    const expiresAt = Math.floor(Date.now() / 1000) - 3600 // 1 hour ago

    const result = createCookie(jwt, expiresAt)
    expect(result).toEqual('_mmt_jwt_development=mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=0; Secure;')
  })
})
