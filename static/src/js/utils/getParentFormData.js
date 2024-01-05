import { cloneDeep } from 'lodash-es'
import removeEmpty from './removeEmpty'

/**
 * This algorithm digs into the JSON and retrieves the parent's data of the specified path.
 * For example, given the full path, e.g. ContactGroups[1].ContactInformation.ContactMechanisms,
 * it will return the parent's form data, e.g., ContactGroups[1].ContactInformation

 * @param {Object} fullPath A object that has the full path of the form
 * @param {Object} fullData A object that has the full JSON data
 */
const getParentFormData = (fullPath, fullData) => {
  const pos = fullPath.lastIndexOf('.')
  let path = fullPath

  if (pos > -1) {
    // Has dotted notation in the field name
    path = path.substring(0, pos)
  } else {
    // Use case for a field name without any dots.
    return fullData
  }

  const parts = path.split('.')
  let data = removeEmpty(cloneDeep(fullData))

  // ContactGroups[1].ContactInformation.ContactMechanisms
  // Iterates through each field (ContactGroups[1], ContactInformation,
  // ContactMechanisms), digging into the JSON
  parts.forEach((part) => {
    const field = part.replace('.', '')
    const regexp = /^(.*[^\\[]+)\[(\d+)\]/
    const match = field.match(regexp)
    if (data[match[1]]) { // Array case
      data = data[match[1]] // Match field name
      data = data.at(match[2]) // Match the index
    } else { // Object case
      data = data[field]
    }
  })

  return data
}

export default getParentFormData
