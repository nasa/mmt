/**
 * Returns array of valid group items: item has id or userType
 * @param {groupItems} groupItems
 * @returns groupItems
 */
const validGroupItems = (groupItems) => groupItems?.filter((item) => item.id || item.userType)
export default validGroupItems
