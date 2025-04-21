import {
  describe,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { XMLBuilder } from 'fast-xml-parser'
import getKmsConceptVersions from '../getKmsConceptVersions'

// Mock the getApplicationConfig function
vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

let consoleErrorSpy

beforeEach(() => {
  vi.clearAllMocks()
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

global.fetch = vi.fn(() => Promise.resolve({
  text: () => Promise.resolve()
}))

describe('getKmsConceptVersions', () => {
  let originalFetch

  beforeAll(() => {
    originalFetch = global.fetch
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  beforeEach(() => {
    global.fetch = vi.fn()
    vi.mocked(getApplicationConfig).mockReturnValue({ kmsHost: 'http://test-kms-host.com' })
  })

  test('fetches and parses KMS concept versions correctly', async () => {
    const mockXmlResponse = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    }).build({
      versions: {
        version: [
          {
            '@_type': 'PUBLISHED',
            '@_creation_date': '2023-06-15',
            '#text': '1.0'
          },
          {
            '@_type': 'DRAFT',
            '@_creation_date': '2023-06-16',
            '#text': '1.1'
          }
        ]
      }
    })

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    })

    const result = await getKmsConceptVersions()

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-kms-host.com/concept_versions/version_type/all',
      { method: 'GET' }
    )

    expect(result).toEqual({
      versions: [
        {
          type: 'PUBLISHED',
          creation_date: '2023-06-15',
          version: '1.0'
        },
        {
          type: 'DRAFT',
          creation_date: '2023-06-16',
          version: '1.1'
        }
      ]
    })
  })

  test('handles errors correctly', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

    await expect(getKmsConceptVersions()).rejects.toThrow('Network error')

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test-kms-host.com/concept_versions/version_type/all',
      { method: 'GET' }
    )
  })

  test('throws an error when the HTTP response is not ok', async () => {
    // Mock a failed HTTP response
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404
    })

    // Assert that the function throws an error with the correct message
    await expect(getKmsConceptVersions()).rejects.toThrow('getKmsConceptVersions HTTP error! status: 404')
  })

  test('handles both array and single object responses', async () => {
    // Test case for array response
    const mockArrayXmlResponse = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    }).build({
      versions: {
        version: [
          {
            '@_type': 'PUBLISHED',
            '@_creation_date': '2023-06-15',
            '#text': '1.0'
          },
          {
            '@_type': 'DRAFT',
            '@_creation_date': '2023-06-16',
            '#text': '1.1'
          }
        ]
      }
    })

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockArrayXmlResponse)
    })

    let result = await getKmsConceptVersions()

    expect(result.versions).toHaveLength(2)
    expect(result.versions[0].version).toBe('1.0')
    expect(result.versions[1].version).toBe('1.1')

    // Test case for single object response
    const mockSingleXmlResponse = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    }).build({
      versions: {
        version: {
          '@_type': 'PUBLISHED',
          '@_creation_date': '2023-06-15',
          '#text': '1.0'
        }
      }
    })

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockSingleXmlResponse)
    })

    result = await getKmsConceptVersions()

    expect(result.versions).toHaveLength(1)
    expect(result.versions[0].version).toBe('1.0')
  })
})
