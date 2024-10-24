import { validUUID } from './validUUID'

/**
 * Given an array of group permissions, removes all items with group ID that is not null
 * and is not an UUID
 * @param {Array} groupPermissions An array of group permissions
 */
const removeLegacyGroupPermissionsByGroupId = (groupPermissions) => {
  const resultArray = []

  groupPermissions.forEach((item) => {
    if (!item.groupId || (item.groupId && validUUID.test(item.groupId))) {
      resultArray.push(item)
    }
  })

  return resultArray
}

export default removeLegacyGroupPermissionsByGroupId
