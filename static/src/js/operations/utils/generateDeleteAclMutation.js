/**
 * Generates a delete mutation for a given concept ID and target.
 *
 * @param {String} conceptId - The concept ID to be deleted.
 * @returns {Object} - The delete mutation object.
 */
const generateDeleteMutation = (mutation, conceptId) => ({
  variables: {
    conceptId
  },
  mutation
})

export default generateDeleteMutation
