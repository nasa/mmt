import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import jwt from 'jsonwebtoken'
import edlRefreshToken from '../handler'
import * as getConfig from '../../../../sharedUtils/getConfig'
import * as createJwtModule from '../../utils/createJwt'
import * as createCookieModule from '../../utils/createCookie'

const originalFetch = global.fetch

describe('edlRefreshToken', () => {
  let fetchMock
  let jwtVerifySpy
  let createJwtSpy
  let createCookieSpy

  beforeEach(() => {
    vi.resetAllMocks()
    fetchMock = vi.fn()
    global.fetch = fetchMock

    process.env.EDL_CLIENT_ID = 'test-client-id'
    process.env.EDL_PASSWORD = 'test-client-secret'
    process.env.JWT_SECRET = 'jwt-secret'
    process.env.COOKIE_DOMAIN = '.example.com'
    delete process.env.IS_OFFLINE
    delete process.env.JWT_VALID_TIME

    vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({
      mmtHost: 'https://mmt.example.com'
    })

    vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({
      host: 'https://edl.example.com'
    })

    jwtVerifySpy = vi.spyOn(jwt, 'verify')
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when refreshing the token succeeds', () => {
    test('should request a new token and return a cookie response', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600
        })
      })

      createJwtSpy = vi.spyOn(createJwtModule, 'default').mockReturnValue('new-jwt')
      createCookieSpy = vi.spyOn(createCookieModule, 'default').mockReturnValue('cookie-string')

      const event = {
        headers: {
          Authorization: 'Bearer abc.def'
        }
      }

      const response = await edlRefreshToken(event)

      expect(fetchMock).toHaveBeenCalledWith(
        'https://edl.example.com/oauth/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Basic ${Buffer.from('test-client-id:test-client-secret').toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          body: expect.stringContaining('grant_type=refresh_token')
        })
      )

      expect(createJwtSpy).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token',
        '2024-01-01T01:00:00.000Z',
        { uid: 'test-user' }
      )

      expect(response.statusCode).toBe(200)
      expect(createCookieSpy).toHaveBeenCalledWith('new-jwt', 1704070800)
      expect(response.headers['Set-Cookie']).toBe('cookie-string')
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
    })
  })

  describe('when running in offline mode', () => {
    test('should return mock tokens without calling EDL', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-02-02T00:00:00Z'))
      process.env.IS_OFFLINE = 'true'

      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      createJwtSpy = vi.spyOn(createJwtModule, 'default').mockReturnValue('offline-jwt')
      createCookieSpy = vi.spyOn(createCookieModule, 'default').mockReturnValue('offline-cookie')

      const event = {
        headers: {
          Authorization: 'Bearer abc.def'
        }
      }

      const response = await edlRefreshToken(event)
      const offlineExpiration = '2024-02-02T00:30:00.000Z'
      const expirationSeconds = Math.floor(new Date(offlineExpiration).getTime() / 1000)

      expect(fetchMock).not.toHaveBeenCalled()
      expect(createJwtSpy).toHaveBeenCalledWith(
        'ABC-1',
        'ABC-1-refresh',
        offlineExpiration,
        { uid: 'test-user' }
      )

      expect(createCookieSpy).toHaveBeenCalledWith('offline-jwt', expirationSeconds)
      expect(response.statusCode).toBe(200)
      expect(response.headers['Set-Cookie']).toBe('offline-cookie')

      delete process.env.IS_OFFLINE
    })
  })

  describe('when refreshing the token fails', () => {
    test('should return an error response when the OAuth server responds with an error', async () => {
      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Error'
      })

      const event = {
        headers: {
          authorization: 'Bearer abc.def'
        }
      }

      const response = await edlRefreshToken(event)

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.body)).toMatchObject({
        error: 'Failed to refresh token'
      })

      expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
    })
  })

  describe('when EDL credentials are missing', () => {
    test('should return an error when client id or secret is not configured', async () => {
      delete process.env.EDL_CLIENT_ID

      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      const event = {
        headers: {
          Authorization: 'Bearer abc.def'
        }
      }

      const response = await edlRefreshToken(event)

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.body)).toMatchObject({
        error: 'Failed to refresh token',
        details: 'EDL client credentials are not properly configured'
      })

      expect(fetchMock).not.toHaveBeenCalled()
      expect(createJwtSpy).not.toHaveBeenCalled()
      expect(createCookieSpy).not.toHaveBeenCalled()
    })
  })

  describe('when JWT_VALID_TIME is set', () => {
    test('should override token expiration for testing refresh logic', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
      process.env.JWT_VALID_TIME = '300' // 5 minutes

      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 86400 // 24 hours from EDL
        })
      })

      createJwtSpy = vi.spyOn(createJwtModule, 'default').mockReturnValue('new-jwt')
      createCookieSpy = vi.spyOn(createCookieModule, 'default').mockReturnValue('cookie-string')

      const event = {
        headers: {
          Authorization: 'Bearer abc.def'
        }
      }

      await edlRefreshToken(event)

      const expectedExpiresAt = new Date(Date.now() + 300 * 1000).toISOString()

      expect(createJwtSpy).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token',
        expectedExpiresAt,
        { uid: 'test-user' }
      )

      delete process.env.JWT_VALID_TIME
    })

    test('should use EDL expiration when JWT_VALID_TIME is not set', async () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

      jwtVerifySpy.mockReturnValue({
        edlProfile: { uid: 'test-user' },
        refreshToken: 'old-refresh-token'
      })

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 86400 // 24 hours from EDL
        })
      })

      createJwtSpy = vi.spyOn(createJwtModule, 'default').mockReturnValue('new-jwt')
      createCookieSpy = vi.spyOn(createCookieModule, 'default').mockReturnValue('cookie-string')

      const event = {
        headers: {
          Authorization: 'Bearer abc.def'
        }
      }

      await edlRefreshToken(event)

      const expectedExpiresAt = new Date(Date.now() + 86400 * 1000).toISOString()

      expect(createJwtSpy).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token',
        expectedExpiresAt,
        { uid: 'test-user' }
      )
    })
  })
})
