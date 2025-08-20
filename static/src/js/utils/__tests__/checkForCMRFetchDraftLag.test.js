import checkForCMRFetchDraftLag from '../checkForCMRFetchDraftLag'

describe('checkForCMRFetchDraftLag', () => {
  describe('when the fetched revision Id and expected revision Id are undefined', () => {
    test('returns undefined', () => {
      expect(checkForCMRFetchDraftLag(`${undefined}`, `${undefined}`)).toEqual(undefined)
    })
  })

  describe('when the fetched revision Id is less than the expected revision Id, indicating a cmr lag', () => {
    test('throws error', () => {
      expect(() => checkForCMRFetchDraftLag('1', '2')).toThrow('Delay in CMR has been detected. Refresh the page in order to see latest revision')
    })
  })

  describe('when the fetched revision Id is greater than the expected revision Id, indicating a draft has been published', () => {
    test('throws error', () => {
      expect(() => checkForCMRFetchDraftLag('2', '1')).not.toThrow('Delay in CMR has been detected. Refresh the page in order to see latest revision')
    })
  })
})
