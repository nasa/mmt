import updateTemplate from '../updateTemplate'

describe('updateTemplates', () => {
  describe('when updateTemplates response is ok', () => {
    test('return a success response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        data: 'mock-data'
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }
      const id = 'Mock Id'

      const response = await updateTemplate(providerId, token, ummMetadata, id)

      expect(response).toEqual({
        ok: true,
        data: 'mock-data'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when updateTemplates response is not ok', () => {
    test('return a error response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        data: 'mock-error-data'
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }
      const id = 'Mock Id'

      const response = await updateTemplate(providerId, token, ummMetadata, id)

      expect(response).toEqual({
        error: 'Error updating template'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when updateTemplates results in a failure ', () => {
    test('return a error response ', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Templates are down')))

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }
      const id = 'mock-id'
      const response = await updateTemplate(providerId, token, ummMetadata, id)

      expect(response).toEqual({ error: 'Error updating template' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
