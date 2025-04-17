import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import getKmsConceptSchemes from '../getKmsConceptSchemes'

// Mock the getApplicationConfig function
vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

// Mock the global fetch function
global.fetch = vi.fn()

describe('getKmsConceptSchemes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()

    // Set up default mock return values
    getApplicationConfig.mockReturnValue({ kmsHost: 'http://example.com' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should correctly transform and filter concept schemes', async () => {
    const mockXmlResponse = `
      <schemes>
        <scheme name="scheme1" longName="Scheme 1" updateDate="2023-01-01" csvHeaders="header1,header2"/>
        <scheme name="scheme2" longName="Scheme 2" updateDate="2023-01-02"/>
        <scheme name="scheme3" longName="Scheme 3" updateDate="2023-01-03" csvHeaders=""/>
        <scheme/>
      </schemes>
    `

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    })

    const result = await getKmsConceptSchemes({ version: '1.0' })

    expect(result).toEqual({
      schemes: [
        { name: 'scheme1', longName: 'Scheme 1', updateDate: '2023-01-01', csvHeaders: ['header1', 'header2'] },
        { name: 'scheme2', longName: 'Scheme 2', updateDate: '2023-01-02', csvHeaders: [] },
        { name: 'scheme3', longName: 'Scheme 3', updateDate: '2023-01-03', csvHeaders: [] }
      ]
    })

    // Verify that the empty scheme was filtered out
    expect(result.schemes.length).toBe(3)

    // Verify that csvHeaders are correctly split or empty
    expect(result.schemes[0].csvHeaders).toEqual(['header1', 'header2'])
    expect(result.schemes[1].csvHeaders).toEqual([])
    expect(result.schemes[2].csvHeaders).toEqual([])
  })

  test('should fetch and parse concept schemes successfully', async () => {
    const mockXmlResponse = `
      <schemes>
        <scheme name="scheme1" longName="Scheme 1" updateDate="2023-01-01" csvHeaders="header1,header2"/>
        <scheme name="scheme2" longName="Scheme 2" updateDate="2023-01-02" csvHeaders="header3,header4"/>
      </schemes>
    `

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    })

    const result = await getKmsConceptSchemes({ version: '1.0' })

    expect(global.fetch).toHaveBeenCalledWith(
      'http://example.com/concept_schemes/?version=1.0',
      { method: 'GET' }
    )

    expect(result).toEqual({
      schemes: [
        {
          name: 'scheme1',
          longName: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        },
        {
          name: 'scheme2',
          longName: 'Scheme 2',
          updateDate: '2023-01-02',
          csvHeaders: ['header3', 'header4']
        }
      ]
    })
  })

  test('should handle a single scheme response', async () => {
    const mockXmlResponse = `
      <schemes>
        <scheme name="scheme1" longName="Scheme 1" updateDate="2023-01-01" csvHeaders="header1,header2"/>
      </schemes>
    `

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockXmlResponse)
    })

    const result = await getKmsConceptSchemes({ version: '1.0' })

    expect(result).toEqual({
      schemes: [
        {
          name: 'scheme1',
          longName: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        }
      ]
    })
  })

  test('should throw an error when fetch fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(getKmsConceptSchemes({ version: '1.0' })).rejects.toThrow(
      'getKmsConceptSchemes HTTP error! status: 404'
    )
  })

  test('should handle network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(getKmsConceptSchemes({ version: '1.0' })).rejects.toThrow('Network error')
  })

  test('should handle XML parsing errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('Invalid XML')
    })

    await expect(getKmsConceptSchemes({ version: '1.0' })).rejects.toThrow()
  })
})
