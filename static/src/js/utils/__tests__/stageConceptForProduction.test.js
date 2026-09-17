import stageConceptForProduction from '../stageConceptForProduction'

describe('stageConceptForProduction', () => {
  describe('when the response is ok', () => {
    test('returns the staged concept link', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          stagedConceptLink: 'http://prod.example.com/collections/staged/mock-record-id'
        })
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const conceptType = 'collections'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      const response = await stageConceptForProduction(providerId, token, conceptType, ummMetadata)

      expect(response).toEqual({
        stagedConceptLink: 'http://prod.example.com/collections/staged/mock-record-id'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/providers/mock-provider-id/collections/stage-for-production',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer mock-jwt',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ummMetadata)
        }
      )
    })
  })

  describe('when the response is not ok', () => {
    test('throws an error with the response error message', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({
          error: 'Staging target rejected the request with status 502'
        })
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const conceptType = 'collections'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      await expect(
        stageConceptForProduction(providerId, token, conceptType, ummMetadata)
      ).rejects.toThrow('Staging target rejected the request with status 502')
    })
  })

  describe('when the response is a 403', () => {
    test('throws a permission-denied message regardless of the response body', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({})
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const conceptType = 'collections'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      await expect(
        stageConceptForProduction(providerId, token, conceptType, ummMetadata)
      ).rejects.toThrow('You do not have permission to stage this provider\'s collections.')
    })
  })

  describe('when the response is not ok and has no body', () => {
    test('throws the fallback staging-failure message instead of a JSON parse error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input'))
      })

      const providerId = 'mock-provider-id'
      const token = 'mock-jwt'
      const conceptType = 'collections'
      const ummMetadata = {
        mock: 'mock ummMetadata'
      }

      await expect(
        stageConceptForProduction(providerId, token, conceptType, ummMetadata)
      ).rejects.toThrow('Failed to stage concept for production')
    })
  })
})
