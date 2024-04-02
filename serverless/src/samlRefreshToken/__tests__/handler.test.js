import samlRefreshToken from '../handler'
import * as getConfig from '../../../../static/src/js/utils/getConfig'

vi.mock('../../../../static/src/js/utils/fetchEdlProfile')

describe('samlRefreshToken', () => {
  const headers = new Headers({})
  headers.getSetCookie = vi.fn(() => (['SBXSESSION=refresh_token']))
  global.fetch = vi.fn(() => Promise.resolve({
    headers,
    json: () => Promise.resolve({
      ok: true,
      statusCode: 200,
      status: 'success'
    })
  }))

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      mmtHost: 'https://mmt.localtest.earthdata.nasa.gov',
      apiHost: 'https://mmt.localtest.earthdata.nasa.gov/dev',
      graphQlHost: 'http://localhost:3013/dev/api',
      cmrHost: 'http://localhost:4000',
      version: 'sit'
    }))
  })

  test('returns a refresh token', async () => {
    const event = { headers: { token: 'ABC-1' } }
    const response = await samlRefreshToken(event)
    const { token } = response.headers
    const { statusCode } = response
    expect(token).toEqual('refresh_token')
    expect(statusCode).toBe(200)
  })

  test('return error response', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('error')))
    const event = { headers: { token: 'ABC-1' } }
    const response = await samlRefreshToken(event).catch((error) => {
      expect(error.message).toEqual('error')
    })
    expect(response).toEqual(undefined)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('return unsuccesful response', async () => {
    headers.getSetCookie = vi.fn(() => (['bogus_cookie=bogus_value']))
    global.fetch = vi.fn(() => Promise.resolve({
      headers,
      json: () => Promise.resolve({
        ok: true,
        statusCode: 500,
        status: 'mock status',
        message: 'mock error'
      })
    }))

    const event = { headers: { token: 'ABC-1' } }
    const response = await samlRefreshToken(event)
    expect(response.headers.message).toEqual('mock error')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
