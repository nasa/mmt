/**
 * Clears form data for all controlled data below the given target key
 * i.e., If the hierarchy has category, topic, term, variable and the
 * specified target key is 'topic', it will clear the form data for term and variable.
 * @param {Object} mapping
 * @param {Object} form A object that needs to clear formData.
 * @param {String} targetKey A fieldName that needs to be cleared.
 */
const clearFormData = (mapping, form, targetKey) => {
  let found = false
  const clearedForm = form
  const { map, clearAdditions = [] } = mapping
  const keys = Object.keys(map)
  keys.forEach((key) => {
    const controlKey = map[key]
    if (controlKey === targetKey) {
      found = true

      return
    }

    if (found) {
      delete clearedForm[key]
    }
  })

  clearAdditions.forEach((name) => {
    const pos = name.lastIndexOf('.')
    if (pos > -1) {
      const parent = name.substring(0, pos)
      let subform = clearedForm[parent]
      if (subform) {
        if (!Array.isArray(subform)) {
          subform = [subform]
        }

        const childField = name.substring(pos + 1)
        subform.forEach((obj) => {
          const tempObject = obj
          delete tempObject[childField]
        })
      }
    } else {
      delete clearedForm[name]
    }
  })

  return clearedForm
}

export default clearFormData
