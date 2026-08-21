import jwt from 'jsonwebtoken'

import getMMTCookieOptions from '../getMMTCookieOptions'

const setProtocol = (protocol) => {
  delete window.location
  window.location = { protocol }
}

describe('getMMTCookieOptions', () => {
  describe('when the token has an expiration', () => {
    test('expires the cookie alongside the token', () => {
      const expiresAt = new Date('2025-01-01T00:00:00.000Z')
      const token = jwt.sign({ exp: expiresAt.getTime() / 1000 }, 'mock-secret')

      const options = getMMTCookieOptions(token)

      expect(options.expires).toEqual(expiresAt)
    })
  })

  describe('when the token has no expiration', () => {
    test('leaves the cookie without an expiration', () => {
      const token = jwt.sign({ edlToken: 'mock-token' }, 'mock-secret', { noTimestamp: true })

      const options = getMMTCookieOptions(token)

      expect(options.expires).toBeUndefined()
    })
  })

  describe('whem the token can not be decoded', () => {
    test('still returns usable options', () => {
      const options = getMMTCookieOptions('not-a-jwt')

      expect(options.expires).toBeUndefined()
      expect(options.path).toBe('/')
    })
  })

  describe('the returned options', () => {
    test('never include a domain, this is by design and keeps the cookie host-only', () => {
      const token = jwt.sign({ edlToken: 'mock-token' }, 'mock-secret')

      // With a domain, the cookie would widen to a parent that
      // every environment shares and each environment's cookie would be sent
      // on requests to all the others
      expect(getMMTCookieOptions(token).domain).toBeUndefined()
    })
  })

  describe('when served over https', () => {
    test('marks the cookie secure', () => {
      setProtocol('https:')

      const token = jwt.sign({ edlToken: 'mock-token' }, 'mock-secret')

      expect(getMMTCookieOptions(token).secure).toBe(true)
    })
  })

  describe('when served over http', () => {
    test('does not mark the cookie secure, so local development works', () => {
      setProtocol('http:')

      const token = jwt.sign({ edlToken: 'mock-token' }, 'mock-secret')

      expect(getMMTCookieOptions(token).secure).toBe(false)
    })
  })
})
