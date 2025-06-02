import { getApplicationConfig } from 'sharedUtils/getConfig'
import { kmsGetConceptUpdatesReport } from '../kmsGetConceptUpdatesReport'

// Mock the getApplicationConfig function
vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

describe('kmsGetConceptUpdatesReport', () => {
  // Mock data
  const mockVersion = {
    version: 'v1.0',
    version_type: 'draft'
  }
  const mockStartDate = '2024-01-01'
  const mockEndDate = '2024-01-31'
  const mockUserId = 'user123'
  const mockKmsHost = 'http://example.com'
  const mockBlob = new Blob(['test data'], { type: 'text/csv' })

  // Setup and teardown
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock getApplicationConfig
    getApplicationConfig.mockReturnValue({ kmsHost: mockKmsHost })

    // // Mock URL.createObjectURL
    // global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    // global.URL.revokeObjectURL = vi.fn()

    // const createObjectMock = vi.fn()
    // window.URL.createObjectURL = createObjectMock

    // // Mock document.body
    // document.body = {
    //   appendChild: vi.fn(),
    //   removeChild: vi.fn()
    // }

    // vi.spyOn(document, 'createElement').mockImplementation(() => ({
    //   setAttribute: vi.fn(),
    //   click: vi.fn(),
    //   href: '',
    //   parentNode: document.body
    // }))

    // // Mock fetch
    // global.fetch = vi.fn()
  })

  test.only('should make a GET request with correct parameters for draft version', async () => {
    // Mock successful fetch response
    // global.fetch.mockImplementationOnce(() => Promise.resolve({
    //   ok: true,
    //   blob: () => Promise.resolve(mockBlob)
    // }))
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    })

    const createObjectMock = vi.fn()
    window.URL.createObjectURL = createObjectMock
    vi.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: vi.fn(),
      click: vi.fn(),
      parentNode: {
        removeChild: vi.fn()
      }
    }))

    document.body.appendChild = vi.fn()

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate,
      userId: mockUserId
    })

    const expectedUrl = `${mockKmsHost}/concepts/operations/update_report?version=${mockVersion.version}&startDate=${mockStartDate}&endDate=${mockEndDate}&userId=${mockUserId}`

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET'
    })
  })

  test.only('should make a GET request with "published" version when version_type is published', async () => {
    const publishedVersion = {
      version: 'v1.0',
      version_type: 'published'
    }

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    }))

    await kmsGetConceptUpdatesReport({
      version: publishedVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    const expectedUrl = `${mockKmsHost}/concepts/operations/update_report?version=published&startDate=${mockStartDate}&endDate=${mockEndDate}`

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET'
    })
  })

  test.skip('should create and trigger download when response is successful', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    }))

    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn()
    }
    document.createElement.mockReturnValue(mockLink)

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', `KeywordUpdateReport-${mockStartDate}-${mockEndDate}`)
    expect(mockLink.click).toHaveBeenCalled()
    expect(document.body.appendChild).toHaveBeenCalled()
  })

  test.only('should throw an error when fetch fails', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)))

    await expect(kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })).rejects.toThrow(`Failed to download report ${errorMessage}`)
  })

  test('should handle optional userId parameter', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    }))

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    const expectedUrl = `${mockKmsHost}/concepts/operations/update_report?version=${mockVersion.version}&startDate=${mockStartDate}&endDate=${mockEndDate}`

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET'
    })
  })
})
