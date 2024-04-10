import { capitalize } from 'lodash-es'
import useRevisionsQuery from '../hooks/useRevisionsQuery'

/**
 * Given a formData with a an array, getRevisionCount will return the length
 * of of the items
 * @param {String} conceptId The conceptId we use to query revision Count
 */
const getRevisionCount = (conceptId, type) => {
  const { revisions } = useRevisionsQuery({
    conceptId,
    type: capitalize(type)
  })

  const { count } = revisions

  return count
}

export default getRevisionCount
