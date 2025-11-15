import createJwt from '../createJwt'

describe('createJwt', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  afterEach(() => {
    delete process.env.JWT_SECRET
  })

  test('returns a signed JWT using provided expiry and refresh token', () => {
    const token = createJwt(
      'mock-access-token',
      'mock-refresh-token',
      '2024-01-02T00:00:00Z',
      { uid: 'mock-uid' }
    )

    expect(token).toEqual(createJwt(
      'mock-access-token',
      'mock-refresh-token',
      '2024-01-02T00:00:00Z',
      { uid: 'mock-uid' }
    ))
  })
})
