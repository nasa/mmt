import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { createUpdateKmsConcept } from '../createUpdateKmsConcept'

// Mock the getApplicationConfig function
vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

beforeEach(() => {
  global.fetch = vi.fn()
  vi.mocked(getApplicationConfig).mockReturnValue({ kmsHost: 'http://kms.example.com' })
})

describe('createUpdateKmsConcept', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  describe('When called with valid parameters', () => {
    it('should make a PUT request to the correct endpoint', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }
      const scheme = { name: 'testScheme' }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, scheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=1.0&scheme=testScheme',
        expect.objectContaining({
          method: 'PUT',
          body: rdfData,
          userNote: 'user note'
        })
      )
    })

    it('should use "published" as version parameter when version_type is "published"', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'published'
      }
      const scheme = { name: 'testScheme' }

      global.fetch.mockResolvedValueOnce({ ok: true })

      await createUpdateKmsConcept(rdfData, userNote, version, scheme)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://kms.example.com/concept?version=published&scheme=testScheme',
        expect.anything()
      )
    })
  })

  describe('When the API request fails', () => {
    it('should throw an error with the correct message', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }
      const scheme = { name: 'testScheme' }

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      })

      await expect(createUpdateKmsConcept(rdfData, userNote, version, scheme))
        .rejects.toThrow('createUpdateKmsConcept HTTP error! status: 400')
    })
  })

  describe('When an unexpected error occurs', () => {
    it('should log the error and rethrow it', async () => {
      const rdfData = 'some rdf data'
      const userNote = 'user note'
      const version = {
        version: '1.0',
        version_type: 'draft'
      }
      const scheme = { name: 'testScheme' }

      const error = new Error('Unexpected error')
      global.fetch.mockRejectedValueOnce(error)

      console.error = vi.fn()

      await expect(createUpdateKmsConcept(rdfData, userNote, version, scheme))
        .rejects.toThrow('Unexpected error')

      expect(console.error).toHaveBeenCalledWith('Error in createUpdateKmsConcept:', error)
    })
  })
})
