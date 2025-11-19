import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach
} from 'vitest'
import jwt from 'jsonwebtoken'
import createJwt from '../createJwt'

describe('createJwt', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  afterEach(() => {
    delete process.env.JWT_SECRET
  })

  test('returns a signed JWT using provided expiry and refresh token', () => {
    const expiresAt = '2024-01-02T00:00:00Z'
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      expiresAt,
      { uid: 'mock-uid' }
    )

    const decoded = jwt.decode(token)
    expect(decoded).toMatchObject({
      edlToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      edlProfile: { uid: 'mock-uid' }
    })

    expect(decoded.exp).toBe(Math.floor(new Date(expiresAt).getTime() / 1000))
  })
})
