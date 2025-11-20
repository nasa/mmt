/**
 * Validates a proposal object for mandatory fields
 * @param {Object} proposal - The proposal object to validate
 * @returns {Object} - An object containing isValid (boolean) and missingFields (array)
 */
export const validateProposal = (proposal) => {
  const mandatoryFields = [
    'id',
    'providerId',
    'shortName',
    'entryTitle',
    'proposalStatus',
    'requestType',
    'submitterId',
    'updatedAt',
    'draft'
  ]

  const missingFields = mandatoryFields.filter((field) => !Object.hasOwn(proposal, field))

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}
