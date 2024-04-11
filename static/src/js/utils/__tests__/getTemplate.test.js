import getTemplate from '../getTemplate'

describe('getTemplate', () => {
  describe('when getTemplate results in a success', () => {
    test('return a success response', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          templateName: 'Mock Template'
        })
      }))

      const providerId = 'mock-provider-id'
      const token = { tokenValue: 'mockToken' }
      const id = 'Mock Id'

      const response = await getTemplate(providerId, token, id)

      expect(response).toEqual({
        response: {
          templateName: 'Mock Template'
        }
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('when getTemplates results in a failure', () => {
    test('return an error', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Templates are down')))

      const providerId = 'mock-provider-id'
      const token = { tokenValue: 'mockToken' }
      const id = 'Mock Id'

      const response = await getTemplate(providerId, token, id)

      expect(response).toEqual({ error: 'Error retrieving template' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
