import { kebabCase } from 'lodash'

/**
 * Gets the next section in the form.
 * @param {Object[]} formConfigurations A configurations of the form with the list of field in each section.
 * @param {String} currentForm Name of the current form.
 */
const getNextFormName = (formConfiguration, currentForm) => {
  // Index of current form (currentForm) in the list of forms (formConfiguration)
  const index = formConfiguration.findIndex((form) => kebabCase(form.displayName) === currentForm)

  // If current form is not found or last in the list, returns first form name
  if ((index === -1) || (index + 1 === formConfiguration.length)) {
    return formConfiguration[0].displayName
  }

  // Next form in the list
  const nextForm = formConfiguration[index + 1]

  return nextForm.displayName
}

export default getNextFormName
