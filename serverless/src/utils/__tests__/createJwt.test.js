import createJwt from '../createJwt'

beforeEach(() => {
  process.env.JWT_SECRET = 'JWT_SECRET'
  process.env.JWT_VALID_TIME = 900000

  const date = new Date(2024)
  vi.setSystemTime(date)
})

describe('createJwt', () => {
  test('returns a JWT', () => {
    const token = createJwt('mock-token', {
      uid: 'mock-uid'
    })

    expect(token).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXVuY2hwYWRUb2tlbiI6Im1vY2stdG9rZW4iLCJlZGxQcm9maWxlIjp7InVpZCI6Im1vY2stdWlkIn0sImlhdCI6MiwiZXhwIjo5MDJ9.RLcFuGj-R_dspzbDTzVlZI8WhyJhHep1WJX3nlSKw3s')
  })
})
