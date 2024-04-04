import getTemplates from '../getTemplates'

describe('getTemplates', () => {
  describe('when getTemplates results in a success', () => {
    test('returns a  success response', async () => {
      global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          id: 'mockId',
          templateName: 'mock name'
        })
      }))

      const providerId = 'mock-provider-id'
      const token = { tokenValue: 'mockToken' }

      const response = await getTemplates(providerId, token)

      expect(response).toEqual({
        response: {
          id: 'mockId',
          templateName: 'mock name'
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

      const response = await getTemplates(providerId, token)

      expect(response).toEqual({ error: 'Error retrieving templates' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
