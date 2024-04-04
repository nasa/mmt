import refreshToken from '../refreshToken'

describe('refreshToken in production mode', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    vi.clearAllMocks()

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))
  })

  afterEach(() => {
    process.env = OLD_ENV
    vi.useRealTimers()
  })

  global.fetch = vi.fn(() => Promise.resolve({
    headers: new Headers({
      token: 'new_token'
    }),
    json: () => Promise.resolve({
      ok: true,
      status: 200
    })
  }))

  test('in production given a valid token, returns a new token', async () => {
    const newToken = await refreshToken('mock_token')

    expect(newToken.tokenValue).toEqual('new_token')
    expect(newToken.tokenExp).toEqual(1704068100000)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4001/dev/saml-refresh-token',
      {
        headers: {
          token: 'mock_token'
        },
        method: 'POST'
      }
    )
  })

  test('in development given a valid token, returns a new token', async () => {
    process.env.NODE_ENV = 'development'
    const newToken = await refreshToken('mock_token')

    expect(newToken.tokenValue).toEqual('ABC-1')

    expect(fetch).toHaveBeenCalledTimes(0)
  })

  test('return error response', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')))

    await refreshToken('mock_token').catch((error) => {
      expect(error.message).toEqual('error')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4001/dev/saml-refresh-token',
      {
        headers: {
          token: 'mock_token'
        },
        method: 'POST'
      }
    )
  })
})
