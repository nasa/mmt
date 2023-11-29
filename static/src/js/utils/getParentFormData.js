import { cloneDeep } from 'lodash'
import removeEmpty from './removeEmpty'

/**
 * Given the full path, e.g. ContactGroups[1].ContactInformation.ContactMechanisms, it will return the parent's
 * form data, e.g., ContactGroups[1].ContactInformation
 * @param {Object} fullPath A object that has the full path of the form
 * @param {Object} fullData A object that has the full data
 */
// This algorithm dives into the formData and retrieves the parent's data.
const getParentFormData = (fullPath, fullData) => {
  const pos = fullPath.lastIndexOf('.')
  let path = fullPath
  if (pos > -1) {
    path = path.substring(0, pos)
  }

  const parts = path.split('.')
  let data = removeEmpty(cloneDeep(fullData))
  parts.forEach((part) => {
    if (part !== '') {
      const p = part.replace('.', '')
      const regexp = /^(.*[^\\[]+)\[(\d+)\]/
      const match = p.match(regexp)
      if (match) {
        data = data[match[1]]
        if (data) {
          data = data.at(match[2])
        }
      } else {
        data = data[p]
      }
    }
  })

  return data
}

export default getParentFormData
