/**
 * Given an array of group permissions, return items has id or userType
 * @param {Array} groupPermissions An array of group permissions
 */
const removeInvalidGroupPermissions = (items) => items.filter((item) => item.id || item.userType)

export default removeInvalidGroupPermissions
