import jwt from 'jsonwebtoken'

import isValidMMTToken from '../isValidMMTToken'

const buildToken = (overrides = {}) => jwt.sign(
  {
    edlToken: 'mock-edl-token',
    refreshToken: 'mock-refresh-token',
    edlProfile: { uid: 'mock-user' },
    exp: Math.floor(Date.now() / 1000) + 900,
    ...overrides
  },
  'mock-secret'
)

describe('isValidMMTToken', () => {
  describe('when given a token this deployment would issue', () => {
    test('returns true', () => {
      expect(isValidMMTToken(buildToken())).toBe(true)
    })
  })

  describe('when given a value that is not a string', () => {
    test('returns false', () => {
      expect(isValidMMTToken(undefined)).toBe(false)
      expect(isValidMMTToken(null)).toBe(false)
      expect(isValidMMTToken({})).toBe(false)
    })
  })

  describe('when given a value that is not a JWT', () => {
    test('returns false', () => {
      expect(isValidMMTToken('crafted; Domain=nasa.gov')).toBe(false)
      expect(isValidMMTToken('not-a-jwt')).toBe(false)
    })
  })

  describe('when a token is missing an MMT attribute', () => {
    test('returns false without edlToken', () => {
      expect(isValidMMTToken(buildToken({ edlToken: undefined }))).toBe(false)
    })

    test('returns false without refreshToken', () => {
      expect(isValidMMTToken(buildToken({ refreshToken: undefined }))).toBe(false)
    })

    test('returns false without edlProfile', () => {
      expect(isValidMMTToken(buildToken({ edlProfile: undefined }))).toBe(false)
    })
  })

  describe('when a token has no usable expiration', () => {
    test('returns false when exp is absent', () => {
      const token = jwt.sign(
        {
          edlToken: 'mock-edl-token',
          refreshToken: 'mock-refresh-token',
          edlProfile: { uid: 'mock-user' }
        },
        'mock-secret',
        { noTimestamp: true }
      )

      expect(isValidMMTToken(token)).toBe(false)
    })
  })

  describe('when the token has expired', () => {
    test('returns false', () => {
      expect(isValidMMTToken(buildToken({ exp: Math.floor(Date.now() / 1000) - 60 }))).toBe(false)
    })
  })
})
