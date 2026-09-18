import getStagedConcept from '../getStagedConcept'

describe('getStagedConcept', () => {
  describe('when the response is ok', () => {
    test('returns the staged concept', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          concept: { EntryTitle: 'Mock Collection' },
          conceptType: 'collections',
          recordId: 'mock-record-id'
        })
      })

      const response = await getStagedConcept('mock-jwt', 'collections', 'mock-record-id')

      expect(response).toEqual({
        concept: { EntryTitle: 'Mock Collection' },
        conceptType: 'collections',
        recordId: 'mock-record-id'
      })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/staged/collections/mock-record-id',
        {
          headers: {
            Authorization: 'Bearer mock-jwt'
          }
        }
      )
    })
  })

  describe('when the response is not ok', () => {
    test('throws an error', async () => {
      global.fetch.mockResolvedValue({
        ok: false
      })

      await expect(
        getStagedConcept('mock-jwt', 'collections', 'mock-record-id')
      ).rejects.toThrow('Staged metadata not found. It may have expired or already been saved as new draft.')
    })
  })
})
