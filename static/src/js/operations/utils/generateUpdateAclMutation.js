import { isNull, omitBy } from 'lodash-es'

/**
 * Generates an update mutation object for updating ACL permissions.
 *
 * @param {String} conceptId - The concept ID.
 * @param {Array} groupPermissions - The group permissions.
 * @param {String} target - The target.
 * @returns {Object} - The update mutation object.
 */
const generateUpdateMutation = (mutation, conceptId, groupPermissions, identity) => ({
  variables: {
    conceptId,
    groupPermissions: groupPermissions.map((gp) => omitBy({
      ...gp,
      group_id: gp.id,
      permissions: gp.permissions
    }, (value, key) => isNull(value) || ['id', '__typename'].includes(key))),
    ...identity
  },
  mutation
})

export default generateUpdateMutation
