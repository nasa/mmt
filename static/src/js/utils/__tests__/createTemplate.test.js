import createTemplate from '../createTemplate'

describe('createTemplates', () => {
  describe('when createTemplate response is ok', () => {
    test('return a success response with template id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          id: 'New Template'
        })
      })

      const providerId = 'mock-provider-id'
      const token = { tokenValue: 'mockToken' }
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      const response = await createTemplate(providerId, token, ummMetadata)

      expect(response).toEqual('New Template')
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when createResponse response is not ok', () => {
    test('return a error response ', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Templates are down')))

      const providerId = 'mock-provider-id'
      const token = { tokenValue: 'mockToken' }
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      const response = await createTemplate(providerId, token, ummMetadata)

      expect(response).toEqual({ error: 'Error creating template' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
