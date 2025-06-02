import { getApplicationConfig } from 'sharedUtils/getConfig'
import { kmsGetConceptUpdatesReport } from '../kmsGetConceptUpdatesReport'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

describe('kmsGetConceptUpdatesReport', () => {
  const mockVersion = {
    version: 'v1.0',
    version_type: 'draft'
  }
  const mockStartDate = '2024-01-01'
  const mockEndDate = '2024-01-31'
  const mockUserId = 'user123'
  const mockKmsHost = 'http://example.com'
  const mockBlob = new Blob(['test data'], { type: 'text/csv' })

  beforeEach(() => {
    vi.clearAllMocks()

    getApplicationConfig.mockReturnValue({ kmsHost: mockKmsHost })
  })

  test('should make a GET request with correct parameters for draft version', async () => {
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

  test('should make a GET request with "published" version when version_type is published', async () => {
    const publishedVersion = {
      version: 'v1.0',
      version_type: 'published'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    })

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

  test('should create and trigger download when response is successful', async () => {
    // Mock the fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    })

    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      parentNode: document.body
    }

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})

    // Setup URL mock
    const mockObjectUrl = 'blob:mock-url'
    window.URL = {
      createObjectURL: vi.fn(() => mockObjectUrl)
    }

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    // Verify the download flow
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', `KeywordUpdateReport-${mockStartDate}-${mockEndDate}`)
    expect(mockLink.click).toHaveBeenCalled()
  })

  test('should throw an error when fetch fails', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    await expect(kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })).rejects.toThrow(`Failed to download report ${errorMessage}`)
  })

  test('should handle optional userId parameter', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob)
    })

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
