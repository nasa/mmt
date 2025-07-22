import draftConceptIdTypes from '../constants/draftConceptIdTypes'

/**
 * Find the concept type based on the provided draftConceptId
 * @param {String} draftConceptId Draft concept ID to determine the concept type
 */
const getConceptTypeByDraftConceptId = (draftConceptId) => {
  if (!draftConceptId) return undefined

  if (draftConceptId.startsWith('VISD')) {
    return draftConceptIdTypes.VISD
  }

  if (draftConceptId.startsWith('CITD')) {
    return draftConceptIdTypes.CITD
  }

  const prefix = draftConceptId.substring(0, 2)

  return draftConceptIdTypes[prefix]
}

export default getConceptTypeByDraftConceptId
