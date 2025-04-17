import xml2js from 'xml2js'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'
import getKmsConceptSchemes from '../getKmsConceptSchemes'

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

describe('getKmsConceptSchemes', () => {
  describe('when getKmsConceptSchemes is called successfully', () => {
    test('schemes are returned', async () => {
      const { kmsHost } = getApplicationConfig()
      const mockXmlResponse = `
        <schemes>
          <scheme name="scheme1" longName="Scheme 1" updateDate="2023-05-01" csvHeaders="header1,header2,header3"/>
          <scheme name="scheme2" longName="Scheme 2" updateDate="2023-05-02" csvHeaders="header4,header5,header6"/>
        </schemes>
      `

      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockXmlResponse)
      }))

      xml2js.Parser.mockImplementation(() => ({
        parseStringPromise: vi.fn().mockResolvedValue({
          schemes: {
            scheme: [
              {
                $: {
                  name: 'scheme1',
                  longName: 'Scheme 1',
                  updateDate: '2023-05-01',
                  csvHeaders: 'header1,header2,header3'
                }
              },
              {
                $: {
                  name: 'scheme2',
                  longName: 'Scheme 2',
                  updateDate: '2023-05-02',
                  csvHeaders: 'header4,header5,header6'
                }
              }
            ]
          }
        })
      }))

      const response = await getKmsConceptSchemes('1.0')

      expect(response).toEqual({
        schemes: [
          {
            name: 'scheme1',
            longName: 'Scheme 1',
            updateDate: '2023-05-01',
            csvHeaders: ['header1', 'header2', 'header3']
          },
          {
            name: 'scheme2',
            longName: 'Scheme 2',
            updateDate: '2023-05-02',
            csvHeaders: ['header4', 'header5', 'header6']
          }
        ]
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(`${kmsHost}/concept_schemes/?version=1.0`, { method: 'GET' })
    })
  })

  describe('when getKmsConceptSchemes call fails', () => {
    test('throws an error', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        ok: false,
        status: 500
      }))

      await expect(getKmsConceptSchemes('1.0')).rejects.toThrow('getKmsConceptSchemes HTTP error! status: 500')
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

      await expect(getKmsConceptSchemes('1.0')).rejects.toThrow('XML parsing error')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  test('handles single scheme response', async () => {
    const { kmsHost } = getApplicationConfig()
    const mockXmlResponse = `
      <schemes>
        <scheme name="scheme1" longName="Scheme 1" updateDate="2023-05-01" csvHeaders="header1,header2,header3"/>
      </schemes>
    `

    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    }))

    xml2js.Parser.mockImplementation(() => ({
      parseStringPromise: vi.fn().mockResolvedValue({
        schemes: {
          scheme: {
            $: {
              name: 'scheme1',
              longName: 'Scheme 1',
              updateDate: '2023-05-01',
              csvHeaders: 'header1,header2,header3'
            }
          }
        }
      })
    }))

    const response = await getKmsConceptSchemes('1.0')

    expect(response).toEqual({
      schemes: [
        {
          name: 'scheme1',
          longName: 'Scheme 1',
          updateDate: '2023-05-01',
          csvHeaders: ['header1', 'header2', 'header3']
        }
      ]
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${kmsHost}/concept_schemes/?version=1.0`, { method: 'GET' })
  })

  test('handles empty response', async () => {
    const { kmsHost } = getApplicationConfig()
    const mockXmlResponse = '<schemes></schemes>'

    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    }))

    xml2js.Parser.mockImplementation(() => ({
      parseStringPromise: vi.fn().mockResolvedValue({
        schemes: {}
      })
    }))

    const response = await getKmsConceptSchemes('1.0')

    expect(response).toEqual({
      schemes: []
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${kmsHost}/concept_schemes/?version=1.0`, { method: 'GET' })
  })
})
