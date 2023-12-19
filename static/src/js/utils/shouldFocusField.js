/**
 * Function to determine if a field should focus
 * @param {String} focusField A name of the field that should focus
 * @param {String} id A id for the field
 */
const shouldFocusField = (focusField, id) => {
  if (focusField === id) {
    return true
  }

  if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      return true
    }
  }

  return false
}

export default shouldFocusField
