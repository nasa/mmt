import { isNull, omitBy } from 'lodash-es'

/**
 * Generates a mutation object for creating ACL (Access Control List) for a target with group permissions.
 *
 * @param {Array} groupPermissions - The group permissions for the ACL.
 * @param {String} target - The target for which the ACL is being created.
 * @returns {Object} - The mutation object.
 */
const generateCreateMutation = (mutation, groupPermissions, identity) => ({
  variables: {
    groupPermissions: groupPermissions.map((gp) => omitBy({
      ...gp,
      group_id: gp.id,
      permissions: gp.permissions
    }, (value, key) => isNull(value) || ['id', '__typename'].includes(key))),
    ...identity
  },
  mutation
})

export default generateCreateMutation
