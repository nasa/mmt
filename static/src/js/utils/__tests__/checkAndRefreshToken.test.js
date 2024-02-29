import checkAndRefreshToken from '../checkAndRefreshToken'
import * as getConfig from '../getConfig'

describe('check and refresh token', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      version: 'sit'
    }))
  })

  test('given a expired token', async () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() - 2)
    expires = new Date(expires)

    const token = {
      tokenValue: 'mock_token',
      tokenExp: expires.valueOf()
    }

    global.fetch = jest.fn(() => Promise.resolve({
      headers: new Headers({
        token: 'refresh_token',
        expires: 1234
      }),
      json: () => Promise.resolve({
        ok: true,
        status: 200,
        json: () => (
          {
            auid: 'cgokey',
            email: 'christopher.d.gokey@nasa.gov',
            name: 'Christopher Gokey'
          }
        )
      })
    }))

    const setCookieFn = jest.fn()
    await checkAndRefreshToken(token, {
      name: 'mock name',
      token
    }, setCookieFn)

    expect(setCookieFn).toBeCalledTimes(1)
    expect(setCookieFn).toBeCalledWith('loginInfo', {
      name: 'mock name',
      token: {
        tokenExp: 1234000,
        tokenValue: 'refresh_token'
      }
    })
  })

  test('given a good token', async () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 2)
    expires = new Date(expires)

    const token = {
      tokenValue: 'mock_token',
      tokenExp: expires.valueOf()
    }

    const setUserFn = jest.fn()
    await checkAndRefreshToken(token, {
      name: 'mock name',
      token
    }, setUserFn)

    expect(setUserFn).toBeCalledTimes(0)
  })

  test('given a null token', async () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 2)
    expires = new Date(expires)

    const token = null

    const setUserFn = jest.fn()
    await checkAndRefreshToken(token, {
      name: 'mock name',
      token
    }, setUserFn)

    expect(setUserFn).toBeCalledTimes(0)
  })
})
