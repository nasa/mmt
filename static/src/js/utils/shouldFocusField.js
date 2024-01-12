/**
 * Function to determine if a field should focus
 * @param {String} focusField A name of the field that should focus
 * @param {String} id A id for the field
 */
const shouldFocusField = (focusField, id) => {
  // Parses out first '_' if present
  const parsedId = id.replace(/^_/, '')
  if (focusField === parsedId) {
    return true
  }

  if (focusField && parsedId.match(/^\w+_\d+$/)) {
    if (parsedId !== '' && parsedId.startsWith(focusField)) {
      return true
    }
  }

  return false
}

export default shouldFocusField
