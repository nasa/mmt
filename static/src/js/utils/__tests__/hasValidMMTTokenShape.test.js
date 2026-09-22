import jwt from 'jsonwebtoken'

import hasValidMMTTokenShape from '../hasValidMMTTokenShape'

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

describe('hasValidMMTTokenShape', () => {
  describe('when given a token this deployment would issue', () => {
    test('returns true', () => {
      expect(hasValidMMTTokenShape(buildToken())).toBe(true)
    })
  })

  describe('when given a value that is not a string', () => {
    test('returns false', () => {
      expect(hasValidMMTTokenShape(undefined)).toBe(false)
      expect(hasValidMMTTokenShape(null)).toBe(false)
      expect(hasValidMMTTokenShape({})).toBe(false)
    })
  })

  describe('when given a value that is not a JWT', () => {
    test('returns false', () => {
      expect(hasValidMMTTokenShape('crafted; Domain=nasa.gov')).toBe(false)
      expect(hasValidMMTTokenShape('not-a-jwt')).toBe(false)
    })
  })

  describe('when a token is missing an MMT property', () => {
    test('returns false without edlToken', () => {
      expect(hasValidMMTTokenShape(buildToken({ edlToken: undefined }))).toBe(false)
    })

    test('returns false without refreshToken', () => {
      expect(hasValidMMTTokenShape(buildToken({ refreshToken: undefined }))).toBe(false)
    })

    test('returns false without edlProfile', () => {
      expect(hasValidMMTTokenShape(buildToken({ edlProfile: undefined }))).toBe(false)
    })
  })

  describe('when a token has an additional or unexpected property', () => {
    test('returns false', () => {
      const token = jwt.sign(
        {
          edlToken: 'mock-edl-token',
          refreshToken: 'mock-refresh-token',
          edlProfile: { uid: 'mock-user' },
          exp: Math.floor(Date.now() / 1000) + 900,
          evilProperty: 'bad-property'
        },
        'mock-secret'
      )

      expect(hasValidMMTTokenShape(token)).toBe(false)
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

      expect(hasValidMMTTokenShape(token)).toBe(false)
    })
  })

  describe('when the token has expired', () => {
    test('returns false', () => {
      expect(hasValidMMTTokenShape(buildToken({ exp: Math.floor(Date.now() / 1000) - 60 }))).toBe(false)
    })
  })
})
