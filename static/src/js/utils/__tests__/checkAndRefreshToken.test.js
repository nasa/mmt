import checkAndRefreshToken from '../checkAndRefreshToken'
import * as getConfig from '../../../../../sharedUtils/getConfig'

describe('check and refresh token', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))

    vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
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

    global.fetch = vi.fn(() => Promise.resolve({
      headers: new Headers({
        token: 'refresh_token'
      }),
      json: () => Promise.resolve({
        ok: true,
        status: 200
      })
    }))

    const callbackFn = vi.fn()
    await checkAndRefreshToken({
      name: 'mock name',
      token
    }, callbackFn)

    let newExp = new Date()
    newExp.setMinutes(newExp.getMinutes() + 15)
    newExp = new Date(newExp)

    expect(callbackFn).toBeCalledTimes(1)
    expect(callbackFn).toBeCalledWith({
      tokenExp: newExp.valueOf(),
      tokenValue: 'refresh_token'
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

    const callbackFn = vi.fn()
    await checkAndRefreshToken({
      name: 'mock name',
      token
    }, callbackFn)

    expect(callbackFn).toBeCalledTimes(0)
  })

  test('given a null token', async () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 2)
    expires = new Date(expires)

    const token = null

    const setUserFn = vi.fn()
    await checkAndRefreshToken({
      name: 'mock name',
      token
    }, setUserFn)

    expect(setUserFn).toBeCalledTimes(0)
  })
})
