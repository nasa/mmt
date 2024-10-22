/**
 * Compares the revision Ids to ensure the draft retched is the most current
 * @param {String} fetchedRevisionId The revision Id that comes back from CMR
 * @param {String} expectedRevisionId The revision Id that was set on ingest (expected revision)
 */

const checkForCMRFetchDraftLag = (fetchedRevisionId, expectedRevisionId) => {
  if ((fetchedRevisionId && expectedRevisionId) && (fetchedRevisionId !== expectedRevisionId)) {
    throw new Error('Delay in CMR has been detected. Refresh the page in order to see latest revision')
  }
}

export default checkForCMRFetchDraftLag
