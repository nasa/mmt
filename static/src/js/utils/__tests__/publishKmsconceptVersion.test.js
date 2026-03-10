import {
  describe,
  expect,
  test,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { publishKmsConceptVersion } from '../publishKmsConceptVersion'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

vi.mock('@/js/utils/getKmsHeaders', () => ({
  getKmsHeaders: vi.fn(() => ({ 'client-id': 'test-client-id' }))
}))

describe('when publishKmsConceptVersion', () => {
  let consoleErrorSpy
  let fetchMock

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock = vi.fn()
    global.fetch = fetchMock
    vi.mocked(getApplicationConfig).mockReturnValue({
      kmsHost: 'http://test-kms-host.com',
      kmKmsClientID: 'test-client-id'
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test('should publish a new KMS concept version successfully', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true })

    await expect(publishKmsConceptVersion('Version 1.0', 'test_token')).resolves.not.toThrow()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://test-kms-host.com/publish?name=Version_1.0',
      {
        method: 'POST',
        headers: {
          'client-id': 'test-client-id',
          Authorization: 'Bearer test_token'
        }
      }
    )
  })

  test('should throw an error when the HTTP response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400
    })

    await expect(publishKmsConceptVersion('Version 1.0', 'test_token')).rejects.toThrow('Error publishing new keyword version: publishKmsconceptVersion HTTP error! status: 400')

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('should throw an error when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(publishKmsConceptVersion('Version 1.0', 'test_token')).rejects.toThrow('Error publishing new keyword version: Network error')

    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  test('should trim and process version string correctly', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true })

    await publishKmsConceptVersion('  Version  1.0  ', 'test_token')

    expect(fetchMock).toHaveBeenCalledWith(
      'http://test-kms-host.com/publish?name=Version_1.0',
      {
        method: 'POST',
        headers: {
          'client-id': 'test-client-id',
          Authorization: 'Bearer test_token'
        }
      }
    )
  })
})
