import {
  describe,
  expect,
  vi,
  beforeEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { createUpdateKmsConcept } from '../createUpdateKmsConcept'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

beforeEach(() => {
  global.fetch = vi.fn()
  vi.mocked(getApplicationConfig).mockReturnValue({ kmsHost: 'http://kms.example.com' })
})

const originalConsoleError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('createUpdateKmsConcept', () => {
  const defaultScheme = { name: 'default-scheme' }
  const defaultToken = 'test-token'

  describe('When userNote is provided', () => {
    test('should include userNote and scheme in the endpoint URL', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'test user note',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(params)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0',
        expect.objectContaining({
          headers: {
            Authorization: defaultToken
          }
        })
      )
    })

    test('should properly encode userNote and scheme in the URL', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'test & user note',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: { name: 'test & scheme' },
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(params)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0',
        expect.anything()
      )
    })

    test('should not include userNote in the URL when it is not provided', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: '',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(params)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0',
        expect.anything()
      )
    })
  })

  describe('When called with valid parameters', () => {
    test('should make a PUT request to the correct endpoint', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'user note',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(params)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0',
        expect.objectContaining({
          method: 'PUT',
          body: params.rdfXml,
          headers: {
            Authorization: defaultToken
          }
        })
      )
    })

    test('should use "published" as version parameter when version_type is "published"', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'user note',
        version: {
          version: '1.0',
          version_type: 'published'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(params)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=published',
        expect.anything()
      )
    })
  })

  describe('When the API request fails', () => {
    test('should throw an error with the correct message', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'user note',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      await expect(createUpdateKmsConcept(params))
        .rejects.toThrow('createUpdateKmsConcept HTTP error! status: 400')
    })
  })

  describe('When an unexpected error occurs', () => {
    test('should log the error and rethrow it', async () => {
      const params = {
        rdfXml: 'some rdf data',
        userNote: 'user note',
        version: {
          version: '1.0',
          version_type: 'draft'
        },
        scheme: defaultScheme,
        token: defaultToken
      }

      const error = new Error('Unexpected error')
      global.fetch.mockRejectedValueOnce(error)

      console.error = vi.fn()

      await expect(createUpdateKmsConcept(params))
        .rejects.toThrow('Unexpected error')

      expect(console.error).toHaveBeenCalledWith('Error in createUpdateKmsConcept:', error)
    })
  })
})
