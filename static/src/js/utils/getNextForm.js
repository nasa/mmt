import { kebabCase } from 'lodash'

const getNextFormName = (formConfiguration, currentForm) => {
  const index = formConfiguration.findIndex((form) => kebabCase(form.displayName) === currentForm)

  if (index + 1 > formConfiguration.length) return formConfiguration[0].displayName

  const nextForm = formConfiguration[index + 1]

  return nextForm.displayName
}

export default getNextFormName
