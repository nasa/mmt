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

  describe('When userNote is provided', () => {
    test('should include userNote and scheme in the endpoint URL', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'test user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, defaultScheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0&scheme=default-scheme&userNote=test%20user%20note',
        expect.anything()
      )
    })

    test('should properly encode userNote and scheme in the URL', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'test & user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }
      const scheme = { name: 'test & scheme' }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, scheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0&scheme=test%20%26%20scheme&userNote=test%20%26%20user%20note',
        expect.anything()
      )
    })

    test('should not include userNote in the URL when it is not provided', async () => {
      const rdfData = 'some rdf data'
      const userNote = ''
      const version = {
        version: '1.0',
        version_type: 'draft'
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, defaultScheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0&scheme=default-scheme',
        expect.anything()
      )
    })
  })

  describe('When called with valid parameters', () => {
    test('should make a PUT request to the correct endpoint', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, defaultScheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0&scheme=default-scheme&userNote=user%20note',
        expect.objectContaining({
          method: 'PUT',
          body: rdfData
        })
      )
    })

    test('should use "published" as version parameter when version_type is "published"', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'published'
      }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, defaultScheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=published&scheme=default-scheme&userNote=user%20note',
        expect.anything()
      )
    })
  })

  describe('When the API request fails', () => {
    test('should throw an error with the correct message', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      await expect(createUpdateKmsConcept(rdfData, userNote, version, defaultScheme))
        .rejects.toThrow('createUpdateKmsConcept HTTP error! status: 400')
    })
  })

  describe('When an unexpected error occurs', () => {
    test('should log the error and rethrow it', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }

      const error = new Error('Unexpected error')
      global.fetch.mockRejectedValueOnce(error)

      console.error = vi.fn()

      await expect(createUpdateKmsConcept(rdfData, userNote, version, defaultScheme))
        .rejects.toThrow('Unexpected error')

      expect(console.error).toHaveBeenCalledWith('Error in createUpdateKmsConcept:', error)
    })
  })
})
