// Clears form data for all controlled data below the given target key
// i.e., If the hierarchy has category, topic, term, variable and the
// specified target key is 'topic', it will clear the form data for term
// and variable.
const clearFormData = (controlled, form, targetKey) => {
  let found = false
  const { map, clearAdditions = [] } = controlled
  const keys = Object.keys(map)
  keys.forEach((key) => {
    const controlKey = map[key]
    if (controlKey === targetKey) {
      found = true

      return
    }

    if (found) {
      // eslint-disable-next-line no-param-reassign
      delete form[key]
    }
  })

  clearAdditions.forEach((name) => {
    const pos = name.lastIndexOf('.')
    if (pos > -1) {
      const parent = name.substring(0, pos)
      let subform = form[parent]
      if (subform) {
        if (!Array.isArray(subform)) {
          subform = [subform]
        }

        const childField = name.substring(pos + 1)
        subform.forEach((obj) => {
          // eslint-disable-next-line no-param-reassign
          delete obj[childField]
        })
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      delete form[name]
    }
  })

  return form
}

export default clearFormData
