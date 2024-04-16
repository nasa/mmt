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

      expect(response).toEqual({ id: 'New Template' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
