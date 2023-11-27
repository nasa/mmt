import { kebabCase } from 'lodash'

/**
 * Gets the next section in the form.
 * @param {Object[]} formConfigurations A configurations of the form with the list of field in each section.
 * @param {String} currentForm Name of the current form.
 */
const getNextFormName = (formConfiguration, currentForm) => {
  const index = formConfiguration.findIndex((form) => kebabCase(form.displayName) === currentForm)

  if (index + 1 > formConfiguration.length) return formConfiguration[0].displayName

  const nextForm = formConfiguration[index + 1]

  return nextForm.displayName
}

export default getNextFormName
