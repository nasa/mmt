import samlRefreshToken from '../handler'
import * as getConfig from '../../../../sharedUtils/getConfig'
import createJwt from '../../utils/createJwt'

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  mmtHost: 'https://mmt.localtest.earthdata.nasa.gov',
  apiHost: 'https://mmt.localtest.earthdata.nasa.gov/dev',
  graphQlHost: 'http://localhost:3013/dev/api',
  cmrHost: 'http://localhost:4000',
  version: 'sit',
  env: 'development'
}))

vi.mock('jsonwebtoken', async () => ({
  default: {
    verify: vi.fn().mockReturnValue({
      edlProfile: { mock: 'profile' },
      launchpadToken: 'mock-token'
    }),
    sign: vi.fn()
  }
}))

vi.mock('../../utils/createJwt', () => ({
  default: vi.fn().mockReturnValue('new-mock-jwt')
}))

describe('samlRefreshToken', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      COOKIE_DOMAIN: '.example.com',
      JWT_VALID_TIME: '900'
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when the token refresh is successful', () => {
    test('returns a refresh token', async () => {
      global.fetch.mockResolvedValue(Promise.resolve({
        headers: {
          getSetCookie: vi.fn(() => (['SBXSESSION=refresh_token']))
        },
        json: () => Promise.resolve({
          ok: true,
          statusCode: 200,
          status: 'success'
        })
      }))

      const event = { headers: { Authorization: 'mock-jwt' } }

      const response = await samlRefreshToken(event)

      const { headers, statusCode } = response
      const { 'Set-Cookie': setCookie } = headers

      expect(statusCode).toBe(200)
      expect(setCookie).toEqual('_mmt_jwt_development=new-mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900; Secure;')

      expect(createJwt).toHaveBeenCalledTimes(1)
      expect(createJwt).toHaveBeenCalledWith('refresh_token', { mock: 'profile' })
    })
  })

  describe('when the token refresh errors', () => {
    test('return error response', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      global.fetch.mockResolvedValue(Promise.resolve({
        headers: {
          getSetCookie: vi.fn(() => (['SBXSESSION=refresh_token']))
        },
        json: () => Promise.resolve({
          ok: false,
          statusCode: 500,
          status: 'mock status',
          message: 'mock error'
        })
      }))

      const event = { headers: { Authorization: 'mock-jwt' } }

      const response = await samlRefreshToken(event).catch((error) => {
        expect(error.message).toEqual('error')
      })

      expect(response).toEqual({
        'Access-Control-Expose-Headers': 'message',
        headers: {
          message: 'mock error'
        },
        statusCode: 500
      })

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Error refreshing launchpad token: mock error')
    })
  })

  describe('when running offline', () => {
    test('returns a refresh token', async () => {
      process.env.IS_OFFLINE = true

      const event = { headers: { Authorization: 'mock-jwt' } }

      const response = await samlRefreshToken(event)

      const { headers, statusCode } = response
      const { 'Set-Cookie': setCookie } = headers

      expect(statusCode).toBe(200)
      expect(setCookie).toEqual('_mmt_jwt_development=new-mock-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900;')

      expect(createJwt).toHaveBeenCalledTimes(1)
      expect(createJwt).toHaveBeenCalledWith('mock-token', { mock: 'profile' })

      expect(global.fetch).toHaveBeenCalledTimes(0)
    })
  })
})
