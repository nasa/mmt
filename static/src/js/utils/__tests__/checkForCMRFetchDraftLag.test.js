import checkForCMRFetchDraftLag from '../checkForCMRFetchDraftLag'

describe('checkForCMRFetchDraftLag', () => {
  describe('when the fetched revision Id and expected revision Id are undefined', () => {
    test('returns undefined', () => {
      expect(checkForCMRFetchDraftLag(`${undefined}`, `${undefined}`)).toEqual(undefined)
    })
  })

  describe('when the fetched revision Id does not match expected revision Id', () => {
    test('throws error', () => {
      expect(() => checkForCMRFetchDraftLag('1', '2')).toThrow('Delay in CMR has detected. Refresh the page in order to see latest revision')
    })
  })
})
