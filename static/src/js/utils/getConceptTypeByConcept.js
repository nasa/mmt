import conceptIdTypes from '../constants/conceptIdTypes'

/**
 * Find the concept type based on the provided conceptId
 * @param {String} conceptId concept ID to determine the concept type
 */
const getConceptTypeByConceptId = (conceptId) => {
  if (!conceptId) return undefined

  const prefix = conceptId.substring(0, 1)

  return conceptIdTypes[prefix]
}

export default getConceptTypeByConceptId
