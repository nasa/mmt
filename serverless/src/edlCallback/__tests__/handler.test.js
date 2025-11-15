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
import createCookie from '../../utils/createCookie'

vi.mock('simple-oauth2')
vi.mock('../../../../sharedUtils/getConfig')
vi.mock('../../utils/fetchEdlProfile')
vi.mock('../../utils/createJwt')
vi.mock('../../utils/createCookie')

describe('edlCallback', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.EDL_CLIENT_ID = 'test-client-id'
    process.env.EDL_PASSWORD = 'test-client-secret'

    vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({
      apiHost: 'https://api.example.com',
      mmtHost: 'https://mmt.example.com',
      env: 'test'
    })

    vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({
      host: 'https://edl.example.com',
      redirectUriPath: '/edl/callback'
    })
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Fdashboard')
        expect(response.headers['Set-Cookie']).toBe('test-cookie')
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

        await expect(edlCallback(mockEvent)).rejects.toThrow('Failed to obtain OAuth token')
      })
    })

    describe('when handling different state parameters', () => {
      test('should use default target when state is not provided', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code'
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

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

        const mockEdlProfile = { uid: 'test-user' }
        fetchEdlProfile.mockResolvedValue(mockEdlProfile)

        await edlCallback(mockEvent)

        expect(createJwt).toHaveBeenCalledWith(
          mockToken.access_token,
          mockToken.refresh_token,
          mockToken.expires_at,
          mockEdlProfile
        )

        expect(createCookie).toHaveBeenCalledWith('test-jwt')
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        const response = await edlCallback(mockEvent)

        expect(response.headers['Access-Control-Allow-Origin']).toBe('*')
        expect(response.headers['Access-Control-Allow-Headers']).toBe('*')
        expect(response.headers['Access-Control-Allow-Methods']).toBe('GET, POST')
        expect(response.headers['Access-Control-Allow-Credentials']).toBe(true)
      })
    })

    describe('when logging token expiration', () => {
      test('should log the token expiration time in local time', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        const expiresAt = new Date('2023-01-01T00:00:00Z').getTime()
        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token',
              refresh_token: 'test-refresh-token',
              expires_at: expiresAt
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        await edlCallback(mockEvent)

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Token expires at:'))
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/))

        consoleSpy.mockRestore()
      })
    })

    describe('when handling different environments', () => {
      test('should use different cookie name for production environment', async () => {
        process.env.NODE_ENV = 'production'

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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-production-cookie')

        const response = await edlCallback(mockEvent)

        expect(response.headers['Set-Cookie']).toBe('test-production-cookie')

        process.env.NODE_ENV = 'test' // Reset environment
      })
    })

    describe('when handling token configuration', () => {
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

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

        await expect(edlCallback(mockEvent)).rejects.toThrow('Failed to obtain OAuth token')
      })
    })

    describe('when handling edge cases', () => {
      test('should handle missing code parameter', async () => {
        const mockEvent = {
          queryStringParameters: {
            state: encodeURIComponent(JSON.stringify({ target: '/' }))
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('Missing code parameter')
      })

      test('should handle invalid state parameter', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: 'invalid-state'
          }
        }

        await expect(edlCallback(mockEvent)).rejects.toThrow('Invalid state parameter')
      })
    })

    describe('when handling successful callback with minimal data', () => {
      test('should return a valid response with minimal data', async () => {
        const mockEvent = {
          queryStringParameters: {
            code: 'test-code',
            state: encodeURIComponent(JSON.stringify({}))
          }
        }

        AuthorizationCode.mockImplementation(() => ({
          getToken: vi.fn().mockResolvedValue({
            token: {
              access_token: 'test-access-token'
            }
          })
        }))

        fetchEdlProfile.mockResolvedValue({})
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        const response = await edlCallback(mockEvent)

        expect(response.statusCode).toBe(303)
        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2F')
        expect(response.headers['Set-Cookie']).toBe('test-cookie')
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        const consoleSpy = vi.spyOn(console, 'log')
        await edlCallback(mockEvent)

        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Token expires at:'))
        consoleSpy.mockRestore()
      })
    })

    describe('when handling different EDL configurations', () => {
      test('should use correct EDL configuration', async () => {
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockImplementation(() => {
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

        fetchEdlProfile.mockResolvedValue({ uid: 'test-user' })
        createJwt.mockReturnValue('test-jwt')
        createCookie.mockReturnValue('test-cookie')

        const response = await edlCallback(mockEvent)

        expect(response.headers.Location).toBe('https://mmt.example.com/auth-callback?target=%2Funusual%20path%3Fparam%3Dvalue%26other%3D123')
      })
    })
  })
})
