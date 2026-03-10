import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import { getKmsHeaders } from '../getKmsHeaders'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

describe('getKmsHeaders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should return headers object with client-id', () => {
    const mockClientId = 'mmt-keyword-manager-sit'
    getApplicationConfig.mockReturnValue({ kmKmsClientID: mockClientId })

    const headers = getKmsHeaders()

    expect(headers).toEqual({
      'client-id': mockClientId
    })
  })

  test('should call getApplicationConfig', () => {
    getApplicationConfig.mockReturnValue({ kmKmsClientID: 'test-client-id' })

    getKmsHeaders()

    expect(getApplicationConfig).toHaveBeenCalledTimes(1)
  })

  test('should return correct client-id for different environments', () => {
    const environments = [
      'mmt-keyword-manager-dev',
      'mmt-keyword-manager-sit',
      'mmt-keyword-manager-uat',
      'mmt-keyword-manager-prod'
    ]

    environments.forEach((clientId) => {
      getApplicationConfig.mockReturnValue({ kmKmsClientID: clientId })

      const headers = getKmsHeaders()

      expect(headers['client-id']).toBe(clientId)
    })
  })

  test('should return headers object structure suitable for fetch API', () => {
    getApplicationConfig.mockReturnValue({ kmKmsClientID: 'test-client-id' })

    const headers = getKmsHeaders()

    expect(typeof headers).toBe('object')
    expect(headers).toHaveProperty('client-id')
    expect(typeof headers['client-id']).toBe('string')
  })
})
