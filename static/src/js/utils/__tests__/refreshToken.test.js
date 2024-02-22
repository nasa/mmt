import { getApplicationConfig } from '../getConfig'
import refreshToken from '../refreshToken'
import * as getConfig from '../getConfig'

describe('refreshToken in production mode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      version: 'sit'
    }))

    const config = getApplicationConfig()
    config.version = 'test'
  })

  global.fetch = jest.fn(() => Promise.resolve({
    headers: new Headers({
      token: 'new_token',
      expires: 1708608183570 / 1000
    }),
    json: () => Promise.resolve({
      ok: true,
      status: 200
    })
  }))

  test('in production given a valid token, returns a new token', async () => {
    const newToken = await refreshToken('mock_token')
    expect(newToken.tokenValue).toEqual('new_token')
    expect(newToken.tokenExp).toEqual(1708608183570)
  })

  test('in development given a valid token, returns a new token', async () => {
    jest.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      version: 'development'
    }))

    const newToken = await refreshToken('mock_token')
    expect(newToken.tokenValue).toEqual('ABC-1')
  })

  test('return error response', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')))
    await refreshToken('mock_token').catch((error) => {
      expect(error.message).toEqual('error')
    })

    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
