import { validUUID } from './validUUID'
/**
 * Given an array of group permissions, removes all items with id that is not null
 * and is not an UUID
 * @param {Array} groupPermissions An array of group permissions
 */
const removeLegacyGroupPermissionsById = (groupPermissions) => {
  const resultArray = []

  groupPermissions.items?.forEach((item) => {
    if (!item.id || (item.id && validUUID.test(item.id))) {
      resultArray.push(item)
    }
  })

  return resultArray
}

export default removeLegacyGroupPermissionsById
