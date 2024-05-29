import delateTemplate from '../deleteTemplate'

describe('deleteTemplate', () => {
  describe('when delete response is ok', () => {
    test('return a success response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        data: 'mock-data'
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const id = '1234-abcd-5678-efgh'

      const response = await delateTemplate(providerId, token, id)

      expect(response).toEqual({
        response: {
          ok: true,
          data: 'mock-data'
        }
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when delete response is not ok', () => {
    test('return a error response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        data: 'mock-error-data'
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const id = '1234-abcd-5678-efgh'

      const response = await delateTemplate(providerId, token, id)

      expect(response).toEqual({
        error: {
          ok: false,
          data: 'mock-error-data'
        }
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
