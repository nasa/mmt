import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import { AuthorizationCode } from 'simple-oauth2'
import edlCallback from '../handler'
import * as getConfig from '../../../../sharedUtils/getConfig'
import fetchEdlProfile from '../../utils/fetchEdlProfile'
import createJwt from '../../utils/createJwt'
import * as createCookieModule from '../../utils/createCookie'

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})

const realCreateCookie = createCookieModule.default
vi.mock('simple-oauth2')
vi.mock('../../../../sharedUtils/getConfig', () => {
  const getApplicationConfig = vi.fn(() => ({
    apiHost: 'https://api.example.com',
    mmtHost: 'https://mmt.example.com',
    env: 'test'
  }))

  const getEdlConfig = vi.fn(() => ({
    host: 'https://edl.example.com',
    redirectUriPath: '/edl/callback'
  }))

  return {
    getApplicationConfig,
    getEdlConfig
  }
})

vi.mock('../../utils/fetchEdlProfile')
vi.mock('../../utils/createJwt')

describe('edlCallback', () => {
  let createCookieSpy

  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2022-12-31T23:45:00Z').getTime())
    process.env.EDL_CLIENT_ID = 'test-client-id'
    process.env.EDL_PASSWORD = 'test-client-secret'
    process.env.COOKIE_DOMAIN = '.example.com'
    delete process.env.IS_OFFLINE

    getConfig.getApplicationConfig.mockReturnValue({
      apiHost: 'https://api.example.com',
      mmtHost: 'https://mmt.example.com',
      env: 'test'
    })

    getConfig.getEdlConfig.mockReturnValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/edl/callback'
    })

    createJwt.mockReturnValue('test-jwt')
    createCookieSpy = vi
      .spyOn(createCookieModule, 'default')
      .mockImplementation((...args) => realCreateCookie(...args))
  })

  describe('when handling EDL callback', () => {
    describe('when the callback is successful', () => {
      test('should return a redirect with a JWT cookie', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/dashboard' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Fdashboard')
        expect(response.headers['Set-Cookie']).toBe('_mmt_jwt_test=test-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900; Secure;')
      })
    })

    describe('when handling invalid assurance levels', () => {
      test('should redirect to unauthorizedMMTAccess when assurance level is not defined', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user' // No assurance level
        })

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/unauthorizedAccess?errorType=deniedAccessMMT')
      })
    })

    describe('when handling assurance levels less than 4', () => {
      test('should redirect to unauthorizedMMTAccess when assurance level is less than 4', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: '3' // Set assurance level to 3
        })

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/unauthorizedAccess?errorType=deniedAccessMMT')
      })
    })

    describe('when handling assurance level 4', () => {
      test('should redirect to auth-callback with target', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: '4'
        })

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2F')
      })
    })

    describe('when running in offline mode', () => {
      test('should issue mock tokens without calling EDL', async () => {
        process.env.IS_OFFLINE = 'true'

        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/dashboard' }))
          }
        }

        fetchEdlProfile.mockResolvedValue({ uid: 'offline-user' })

        const response = await edlCallback(mockEvent)
        const offlineExpiration = '2023-01-01T00:15:00.000Z'
        const expectedExpirationSeconds = Math.floor(new Date(offlineExpiration).getTime() / 1000)

        expect(AuthorizationCode).not.toHaveBeenCalled()
        expect(fetchEdlProfile).toHaveBeenCalledWith('ABC-1')
        expect(createJwt).toHaveBeenCalledWith(
          'ABC-1',
          'ABC-1-refresh',
          offlineExpiration,
          { uid: 'offline-user' }
        )

        expect(createCookieSpy).toHaveBeenCalledWith('test-jwt', expectedExpirationSeconds)
        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Fdashboard')

        delete process.env.IS_OFFLINE
      })
    })

    describe('when environment variables are not set', () => {
      test('should throw an error if EDL_CLIENT_ID is not set', async () => {
        delete process.env.EDL_CLIENT_ID

        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('EDL client credentials are not properly configured')
      })

      test('should throw an error if EDL_PASSWORD is not set', async () => {
        delete process.env.EDL_PASSWORD

        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('EDL client credentials are not properly configured')
      })
    })

    describe('when token retrieval fails', () => {
      test('should throw an error', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockRejectedValue(new Error('Token retrieval failed'))
        }))

        await expect(edlCallback(mockEvent)).rejects.toThrow('Token retrieval failed')
      })
    })

    describe('when handling different state parameters', () => {
      test('should use the default target when state encodes the login fallback', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2F')
      })

      test('should handle custom target in state', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/custom-page' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Fcustom-page')
      })
    })

    describe('when creating JWT and cookie', () => {
      test('should call createJwt and createCookie with correct parameters', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        const mockToken = {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_at: '2023-01-01T00:00:00Z'
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({ token: mockToken })
        }))

        const mockEdlProfile = {
          uid: 'test-user',
          assuranceLevel: 5
        }
        fetchEdlProfile.mockResolvedValue(mockEdlProfile)

        await edlCallback(mockEvent)
        const expectedExpirationSeconds = Math.floor(
          new Date(mockToken.expires_at).getTime() / 1000
        )

        expect(createJwt).toHaveBeenCalledWith(
          mockToken.access_token,
          mockToken.refresh_token,
          mockToken.expires_at,
          mockEdlProfile
        )

        expect(createCookieSpy).toHaveBeenCalledWith('test-jwt', expectedExpirationSeconds)
      })
    })

    describe('when handling errors', () => {
      test('should throw an error if fetchEdlProfile fails', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockRejectedValue(new Error('Failed to fetch EDL profile'))

        await expect(edlCallback(mockEvent)).rejects.toThrow('Failed to fetch EDL profile')
      })
    })

    describe('when handling CORS headers', () => {
      test('should include correct CORS headers in the response', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
        expect(response.headers['Access-Control-Allow-Headers']).toBe('*')
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET, POST')
        expect(response.headers['Access-Control-Allow-Credentials']).toBe(true)
      })
    })

    describe('when handling cookie naming', () => {
      test('should include the environment name in the cookie prefix', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.headers['Set-Cookie']).toContain('_mmt_jwt_test=')
      })
    })

    describe('when building the tokenConfig', () => {
      test('should use correct token configuration', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        const mockGetToken = vi.fn().mockResolvedValue({
          token: {
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_at: '2023-01-01T00:00:00Z'
          }
        })

        AuthorizationCode.mockImplementation(() => ({
          getToken: mockGetToken
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        await edlCallback(mockEvent)

        expect(mockGetToken).toHaveBeenCalledWith({
          code: 'test-code',
          redirect_uri: 'https://api.example.com/edl/callback',
          grant_type: 'authorization_code'
        })
      })
    })

    describe('when handling errors in token retrieval', () => {
      test('should throw an error if token retrieval fails', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockRejectedValue(new Error('Token retrieval failed'))
        }))

        await expect(edlCallback(mockEvent)).rejects.toThrow('Token retrieval failed')
      })
    })

    describe('when handling edge cases', () => {
      test('should handle missing code parameter', async () => {
        const mockEvent = {
          queryStringParameters: {
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('Failed to obtain OAuth token')
      })

      test('should handle invalid state parameter', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: 'invalid-state'
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('Unexpected token')
      })
    })

    describe('when handling successful callback with minimal data', () => {
      test('should return a valid response with target of /', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({}))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({ assuranceLevel: 5 })

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2F')
        expect(response.headers['Set-Cookie']).toBe('_mmt_jwt_test=test-jwt; SameSite=Strict; Path=/; Domain=.example.com; Max-Age=900; Secure;')
      })
    })

    describe('when handling token expiration', () => {
      test('should handle tokens without expiration', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token'
            }
          })
        }))

        const mockEdlProfile = {
          uid: 'test-user',
          assuranceLevel: 5
        }
        fetchEdlProfile.mockResolvedValue(mockEdlProfile)

        await edlCallback(mockEvent)

        expect(createJwt).toHaveBeenCalledWith(
          'test-access-token',
          'test-refresh-token',
          undefined,
          mockEdlProfile
        )
      })
    })

    describe('when handling different EDL configurations', () => {
      test('should use correct EDL configuration', async () => {
        getConfig.getApplicationConfig.mockReturnValue({
          apiHost: 'https://custom-api.example.com',
          mmtHost: 'https://custom-mmt.example.com',
          env: 'test'
        })

        getConfig.getEdlConfig.mockReturnValue({
          host: 'https://custom-edl.example.com',
          redirectUriPath: '/custom-redirect'
        })

        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(AuthorizationCode).toHaveBeenCalledWith(expect.objectContaining({
          auth: expect.objectContaining({
            tokenHost: 'https://custom-edl.example.com'
          })
        }))

        expect(response.headers.Location).toBe('https://custom-mmt.example.com/auth-callback?target=%2F')
      })
    })

    describe('when handling errors in createJwt or createCookie', () => {
      test('should throw an error if createJwt fails', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        createJwt.mockImplementation(() => {
          throw new Error('JWT creation failed')
        })

        await expect(edlCallback(mockEvent)).rejects.toThrow('JWT creation failed')
      })

      test('should throw an error if createCookie fails', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        createJwt.mockReturnValue('test-jwt')
        createCookieSpy.mockImplementation(() => {
          throw new Error('Cookie creation failed')
        })

        await expect(edlCallback(mockEvent)).rejects.toThrow('Cookie creation failed')
      })
    })

    describe('when handling unusual target URLs', () => {
      test('should properly encode unusual target URLs', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/unusual path?param=value&other=123' }))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: '2023-01-01T00:00:00Z'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({
          uid: 'test-user',
          assuranceLevel: 5
        })

        const response = await edlCallback(mockEvent)

        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Funusual%20path%3Fparam%3Dvalue%26other%3D123')
      })
    })
  })
})
