import conceptIdTypes from '../constants/conceptIdTypes'

/**
 * Find the concept type based on the provided conceptId
 * @param {String} conceptId concept ID to determine the concept type
 */
const getConceptTypeByConceptId = (conceptId) => {
  if (!conceptId) return undefined

  if (conceptId.startsWith('VIS')) {
    return conceptIdTypes.VIS
  }

  if (conceptId.startsWith('CIT')) {
    return conceptIdTypes.CIT
  }

  const prefix = conceptId.charAt(0)

  return conceptIdTypes[prefix]
}

export default getConceptTypeByConceptId
