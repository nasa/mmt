// Mapping of draft concept id prefixes to concept types
const draftConceptIdTypes = {
  CD: 'Collection',
  SD: 'Service',
  TD: 'Tool',
  VD: 'Variable'
}

/**
 * Find the concept type based on the provided draftConceptId
 * @param {String} draftConceptId Draft concept ID to determine the concept type
 */
const getConceptTypeByDraftConceptId = (draftConceptId) => {
  const prefix = draftConceptId.substring(0, 2)

  return draftConceptIdTypes[prefix]
}

export default getConceptTypeByDraftConceptId
