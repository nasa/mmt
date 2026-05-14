import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import fetchEdlProfile from '../fetchEdlProfile'
import * as getConfig from '../../../../sharedUtils/getConfig'

const originalFetch = global.fetch

describe('fetchEdlProfile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
    vi.spyOn(getConfig, 'getEdlConfig').mockReturnValue({
      host: 'https://edl.example.com'
    })
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('when access tokens are provided', () => {
    test('returns a user profile when provided an access token string', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          nams_auid: 'user.name',
          uid: 'user.name',
          first_name: 'User',
          last_name: 'Name',
          assurance_level: 'aal2'
        })
      })

      const profile = await fetchEdlProfile('mock-token')

      expect(profile).toEqual({
        auid: 'user.name',
        name: 'User Name',
        uid: 'user.name',
        assuranceLevel: 'aal2'
      })

      expect(global.fetch).toHaveBeenCalledWith('https://edl.example.com/oauth/userInfo', {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'GET'
      })
    })

    test('builds the users name from uid when name fields are blank', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          nams_auid: 'user.name',
          uid: 'user.name',
          first_name: '',
          last_name: '',
          assurance_level: 'aal1'
        })
      })

      const profile = await fetchEdlProfile('mock-token')

      expect(profile.name).toBe('user.name')
    })

    test('supports oauth token objects and extracts access token', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          nams_auid: 'user.name',
          uid: 'user.name'
        })
      })

      const oauthToken = {
        token: {
          access_token: 'object-token'
        }
      }

      await fetchEdlProfile(oauthToken)

      expect(global.fetch).toHaveBeenCalledWith('https://edl.example.com/oauth/userInfo', expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer object-token' })
      }))
    })
  })

  describe('when special-cased tokens are provided', () => {
    test('returns the admin profile when the token is ABC-1 without making a request', async () => {
      const profile = await fetchEdlProfile('ABC-1')

      expect(profile).toEqual({
        auid: 'admin',
        name: 'Admin User',
        uid: 'admin'
      })

      expect(global.fetch).not.toHaveBeenCalled()
    })

    test('throws when an invalid token object is provided', async () => {
      await expect(fetchEdlProfile({})).rejects.toThrow('Invalid token provided')
    })
  })

  describe('when the upstream request fails', () => {
    test('throws when the EDL response is not ok', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(fetchEdlProfile('mock-token')).rejects.toThrow('HTTP error! status: 500')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    test('rethrows fetch failures', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      global.fetch.mockRejectedValue(new Error('Network error'))

      await expect(fetchEdlProfile('mock-token')).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('fetchEdlProfile Error: ', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})
