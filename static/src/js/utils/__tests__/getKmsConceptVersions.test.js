import xml2js from 'xml2js'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import getKmsConceptVersions from '../getKmsConceptVersions'

vi.mock('xml2js', () => ({
  default: {
    Parser: vi.fn().mockImplementation(() => ({
      parseStringPromise: vi.fn()
    }))
  }
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
  describe('when getKmsConceptVersions is called successfully', () => {
    test('versions are returned', async () => {
      const { kmsHost } = getApplicationConfig()
      const mockXmlResponse = `
        <versions>
          <version type="published" creation_date="2023-05-01">1.0</version>
          <version type="past_published" creation_date="2023-04-01">0.9</version>
          <version type="draft" creation_date="2023-05-15">1.1</version>
        </versions>
      `

      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockXmlResponse)
      }))

      xml2js.Parser.mockImplementation(() => ({
        parseStringPromise: vi.fn().mockResolvedValue({
          versions: {
            version: [
              {
                $: {
                  type: 'published',
                  creation_date: '2023-05-01'
                },
                _: '1.0'
              },
              {
                $: {
                  type: 'past_published',
                  creation_date: '2023-04-01'
                },
                _: '0.9'
              },
              {
                $: {
                  type: 'draft',
                  creation_date: '2023-05-15'
                },
                _: '1.1'
              }
            ]
          }
        })
      }))

      const response = await getKmsConceptVersions()

      expect(response).toEqual({
        versions: [
          {
            type: 'published',
            creation_date: '2023-05-01',
            version: '1.0'
          },
          {
            type: 'past_published',
            creation_date: '2023-04-01',
            version: '0.9'
          },
          {
            type: 'draft',
            creation_date: '2023-05-15',
            version: '1.1'
          }
        ]
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(`${kmsHost}/concept_versions/version_type/all`, { method: 'GET' })
    })
  })

  describe('when getKmsConceptVersions call fails', () => {
    test('throws an error', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        ok: false,
        status: 500
      }))

      await expect(getKmsConceptVersions()).rejects.toThrow('getKmsConceptVersions HTTP error! status: 500')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when XML parsing fails', () => {
    test('throws an error', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve('<invalid>xml</invalid>')
      }))

      xml2js.Parser.mockImplementation(() => ({
        parseStringPromise: vi.fn().mockRejectedValue(new Error('XML parsing error'))
      }))

      await expect(getKmsConceptVersions()).rejects.toThrow('XML parsing error')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  test('handles single version response', async () => {
    const { kmsHost } = getApplicationConfig()
    const mockXmlResponse = `
      <versions>
        <version type="published" creation_date="2023-05-01">1.0</version>
      </versions>
    `

    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    }))

    xml2js.Parser.mockImplementation(() => ({
      parseStringPromise: vi.fn().mockResolvedValue({
        versions: {
          version: {
            $: {
              type: 'published',
              creation_date: '2023-05-01'
            },
            _: '1.0'
          }
        }
      })
    }))

    const response = await getKmsConceptVersions()

    expect(response).toEqual({
      versions: [
        {
          type: 'published',
          creation_date: '2023-05-01',
          version: '1.0'
        }
      ]
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${kmsHost}/concept_versions/version_type/all`, { method: 'GET' })
  })
})
