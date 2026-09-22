import deleteStagedConcept from '../deleteStagedConcept'

describe('deleteStagedConcept', () => {
  describe('when the response is ok', () => {
    test('does not throw', async () => {
      global.fetch.mockResolvedValue({
        ok: true
      })

      await expect(
        deleteStagedConcept('mock-jwt', 'collections', 'mock-record-id')
      ).resolves.toBeUndefined()

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/dev/staged/collections/mock-record-id',
        {
          method: 'DELETE',
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
        deleteStagedConcept('mock-jwt', 'collections', 'mock-record-id')
      ).rejects.toThrow('Failed to delete staged metadata')
    })
  })
})
