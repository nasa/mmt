/**
 * Given a formData with a an array, getTagCount will return the length
 * of of the items
 * @param {Object} formData An Object with the data
 */
const getTagCount = (formData) => {
  if (!formData) return 0

  const { items: tagItems } = formData

  return tagItems.length
}

export default getTagCount
