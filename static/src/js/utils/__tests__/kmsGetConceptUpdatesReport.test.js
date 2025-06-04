import { getApplicationConfig } from 'sharedUtils/getConfig'
import constructDownloadableFile from '@/js/utils/constructDownloadableFile'
import { kmsGetConceptUpdatesReport } from '../kmsGetConceptUpdatesReport'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

vi.mock('@/js/utils/constructDownloadableFile', () => ({
  default: vi.fn()
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
  const mockCsvData = 'test,data\n1,2,3'

  beforeEach(() => {
    vi.clearAllMocks()

    getApplicationConfig.mockReturnValue({ kmsHost: mockKmsHost })
  })

  test('should make a GET request with correct parameters for draft version', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCsvData)
    })

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
      text: () => Promise.resolve(mockCsvData)
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

    expect(constructDownloadableFile).toHaveBeenCalledWith(
      mockCsvData,
      `KeywordUpdateReport-${mockStartDate}-${mockEndDate}`,
      'text/csv'
    )
  })

  test('should call constructDownloadableFile with correct parameters when response is successful', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCsvData)
    })

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    expect(constructDownloadableFile).toHaveBeenCalledWith(
      mockCsvData,
      `KeywordUpdateReport-${mockStartDate}-${mockEndDate}`,
      'text/csv'
    )
  })

  test('should create and trigger download when response is successful', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCsvData)
    })

    await kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    expect(constructDownloadableFile).toHaveBeenCalledWith(
      mockCsvData,
      `KeywordUpdateReport-${mockStartDate}-${mockEndDate}`,
      'text/csv'
    )
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
      text: () => Promise.resolve(mockCsvData)
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

  test('should properly encode version parameter', async () => {
    const versionWithSpecialChars = {
      version: 'v1.0 (special)',
      version_type: 'draft'
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCsvData)
    })

    await kmsGetConceptUpdatesReport({
      version: versionWithSpecialChars,
      startDate: mockStartDate,
      endDate: mockEndDate
    })

    const expectedUrl = `${mockKmsHost}/concepts/operations/update_report?version=${encodeURIComponent(versionWithSpecialChars.version)}&startDate=${mockStartDate}&endDate=${mockEndDate}`

    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET'
    })
  })

  test('should log error to console when fetch fails', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })).rejects.toThrow()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in kmsGetConceptUpdatesReport:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  test('should rethrow error after logging', async () => {
    const errorMessage = 'Network error'
    global.fetch.mockRejectedValueOnce(new Error(errorMessage))

    await expect(kmsGetConceptUpdatesReport({
      version: mockVersion,
      startDate: mockStartDate,
      endDate: mockEndDate
    })).rejects.toThrow(`Failed to download report ${errorMessage}`)
  })
})
