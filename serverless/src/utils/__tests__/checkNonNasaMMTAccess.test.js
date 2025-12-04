import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import checkNonNasaMMTAccess from '../checkNonNasaMMTAccess'
import * as getConfig from '../../../../sharedUtils/getConfig'

const originalConsoleError = console.error

describe('checkNonNasaMMTAccess', () => {
  beforeEach(() => {
    vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({
      cmrHost: 'https://cmr.example.com'
    })

    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe('When making a request to the CMR access control endpoint', () => {
    test('should use the expected URL and headers', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] })
      })

      await checkNonNasaMMTAccess('testUser', 'testToken')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://cmr.example.com/access-control/acls?permitted_user=testUser&identity_type=Provider&target=NON_NASA_DRAFT_USER&page_size=2000',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer testToken',
            'Content-Type': 'application/json'
          }
        }
      )
    })
  })

  describe('When the response does not contain items', () => {
    test('should return false and not throw an error', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({})
      })

      await expect(async () => {
        const result = await checkNonNasaMMTAccess('testUser', 'testToken')
        expect(result).toBe(false)
      }).not.toThrow()
    })
  })

  describe('When the user has Non-NASA Draft access', () => {
    test('should return true', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [{ name: 'Provider - CMR_ONLY - NON_NASA_DRAFT_USER' }]
        })
      })

      await expect(async () => {
        const result = await checkNonNasaMMTAccess('testUser', 'testToken')
        expect(result).toBe(true)
      }).not.toThrow()
    })
  })

  describe('When the user does not have Non-NASA Draft access', () => {
    test('should return false', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [{ name: 'Some_Other_ACL' }]
        })
      })

      await expect(async () => {
        const result = await checkNonNasaMMTAccess('testUser', 'testToken')
        expect(result).toBe(false)
      }).not.toThrow()
    })
  })

  describe('When the CMR response is not ok', () => {
    test('should throw an error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(checkNonNasaMMTAccess('testUser', 'testToken')).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('When there is a network error', () => {
    test('should throw an error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      global.fetch.mockRejectedValue(new Error('Network error'))

      await expect(checkNonNasaMMTAccess('testUser', 'testToken')).rejects.toThrow('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('Error checking Non-NASA MMT access:', expect.any(Error))
    })
  })
})
