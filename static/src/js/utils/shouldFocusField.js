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
