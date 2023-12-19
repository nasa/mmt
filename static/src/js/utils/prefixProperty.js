/**
 * Returns the given property prefixed by a `.`
 * @param {String} property Property to prefix
 */
const prefixProperty = (property) => {
  if (property.startsWith('.')) return property

  return `.${property}`
}

export default prefixProperty
