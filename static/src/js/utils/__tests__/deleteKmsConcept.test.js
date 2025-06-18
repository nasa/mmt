import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { deleteKmsConcept } from '../deleteKmsConcept'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

describe('deleteKmsConcept', () => {
  const mockKmsHost = 'https://mock-kms-host.com'
  const mockConceptId = '12345'
  const mockVersion = '1.0'
  const mockToken = 'Bearer mock-token'
  let consoleErrorSpy

  beforeEach(() => {
    vi.clearAllMocks()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getApplicationConfig.mockReturnValue({ kmsHost: mockKmsHost })
    global.fetch = vi.fn()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    vi.resetAllMocks()
  })

  test('When called with valid parameters, should make a DELETE request to the correct endpoint', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true })

    await deleteKmsConcept({
      conceptId: mockConceptId,
      version: mockVersion,
      token: mockToken
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockKmsHost}/concept/${mockConceptId}?version=${mockVersion}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: mockToken
        }
      }
    )
  })

  test('When the server responds with an error, should throw an error with the status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(deleteKmsConcept({
      conceptId: mockConceptId,
      version: mockVersion,
      token: mockToken
    }))
      .rejects.toThrow('deleteKmsConcept HTTP error! status: 404')
  })

  test('When a network error occurs, should throw an error with the error message', async () => {
    const networkError = new Error('Network error')
    global.fetch.mockRejectedValueOnce(networkError)

    await expect(deleteKmsConcept({
      conceptId: mockConceptId,
      version: mockVersion,
      token: mockToken
    }))
      .rejects.toThrow('Error deleting keyword: Network error')
  })

  test('When getApplicationConfig throws an error, should propagate the error', async () => {
    const configError = new Error('Config error')
    getApplicationConfig.mockImplementationOnce(() => {
      throw configError
    })

    await expect(deleteKmsConcept({
      conceptId: mockConceptId,
      version: mockVersion,
      token: mockToken
    }))
      .rejects.toThrow('Error deleting keyword: Config error')
  })
})
