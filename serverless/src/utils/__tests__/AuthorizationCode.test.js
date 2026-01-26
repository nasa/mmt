import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'

import AuthorizationCode from '../AuthorizationCode'

const originalFetch = global.fetch

describe('AuthorizationCode', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('when instantiated', () => {
    test('should store the provided config', () => {
      const config = {
        client: {
          id: 'client-id',
          secret: 'client-secret'
        },
        auth: {
          tokenHost: 'https://edl.example.com',
          tokenPath: '/oauth/token'
        }
      }

      const client = new AuthorizationCode(config)

      expect(client.config).toBe(config)
    })
  })

  describe('when requesting a token', () => {
    test('should POST to the token endpoint and return the normalized token response', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(new Date('2022-01-01T00:00:00Z').getTime())

      const config = {
        client: {
          id: 'client-id',
          secret: 'client-secret'
        },
        auth: {
          tokenHost: 'https://edl.example.com',
          tokenPath: '/oauth/token'
        }
      }

      const tokenConfig = {
        grant_type: 'authorization_code',
        code: 'auth-code',
        redirect_uri: 'https://api.example.com/edl/callback'
      }

      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify({
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_in: 3600
        })
      })

      const client = new AuthorizationCode(config)
      const response = await client.getToken(tokenConfig)

      expect(response).toEqual({
        token: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_at: 1640998800
        }
      })

      const expectedCredentials = Buffer.from('client-id:client-secret').toString('base64')

      expect(global.fetch).toHaveBeenCalledWith('https://edl.example.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${expectedCredentials}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: 'auth-code',
          redirect_uri: 'https://api.example.com/edl/callback'
        }).toString()
      })
    })

    describe('when the upstream returns a non-ok response', () => {
      test('should log and rethrow an error that includes status and body', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const config = {
          client: {
            id: 'client-id',
            secret: 'client-secret'
          },
          auth: {
            tokenHost: 'https://edl.example.com',
            tokenPath: '/oauth/token'
          }
        }

        global.fetch.mockResolvedValue({
          ok: false,
          status: 401,
          text: async () => 'unauthorized'
        })

        const client = new AuthorizationCode(config)

        await expect(client.getToken({
          grant_type: 'authorization_code',
          code: 'auth-code',
          redirect_uri: 'https://api.example.com/edl/callback'
        })).rejects.toThrow('HTTP error! status: 401, body: unauthorized')

        expect(consoleErrorSpy).toHaveBeenCalledWith('Authentication Error:', expect.any(String))
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error Stack:', expect.any(String))
      })
    })

    describe('when fetch throws', () => {
      test('should log and rethrow the original error', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const config = {
          client: {
            id: 'client-id',
            secret: 'client-secret'
          },
          auth: {
            tokenHost: 'https://edl.example.com',
            tokenPath: '/oauth/token'
          }
        }

        global.fetch.mockRejectedValue(new Error('Network error'))

        const client = new AuthorizationCode(config)

        await expect(client.getToken({
          grant_type: 'authorization_code',
          code: 'auth-code',
          redirect_uri: 'https://api.example.com/edl/callback'
        })).rejects.toThrow('Network error')

        expect(consoleErrorSpy).toHaveBeenCalledWith('Authentication Error:', 'Network error')
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error Stack:', expect.any(String))
      })
    })
  })
})
