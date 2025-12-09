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

  describe('When making a request to the CMR permissions endpoint', () => {
    test('should use the correct URL and headers', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ NON_NASA_DRAFT_USER: [] })
      })

      await checkNonNasaMMTAccess('testUser', 'testToken')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://cmr.example.com/access-control/permissions?target=NON_NASA_DRAFT_USER&provider=SCIOPS&user_id=testUser',
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

  describe('When the response does not contain NON_NASA_DRAFT_USER', () => {
    test('should return false', async () => {
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

  describe('When the user has create permission for Non-NASA Draft', () => {
    test('should return true', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          NON_NASA_DRAFT_USER: ['read', 'create', 'update', 'delete']
        })
      })

      await expect(async () => {
        const result = await checkNonNasaMMTAccess('testUser', 'testToken')
        expect(result).toBe(true)
      }).not.toThrow()
    })
  })

  describe('When the user does not have create permission for Non-NASA Draft', () => {
    test('should return false', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          NON_NASA_DRAFT_USER: ['read', 'update', 'delete']
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
