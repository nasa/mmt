import { useQuery } from '@apollo/client'

import useAppContext from './useAppContext'

import { GET_PERMISSIONS } from '../operations/queries/getPermissions'

/**
 * Requests the provided permissions from CMR
 * @param {Object} params Object containing permissions to check
 * @param {Array} params.systemGroup Array of permissions to check in the system object 'GROUP'
 * @returns {Object} Object that has the loading state, and a boolean for the requested permissions
 */
const usePermissions = ({
  systemGroup
}) => {
  const { user } = useAppContext()

  const { data, loading } = useQuery(GET_PERMISSIONS, {
    skip: !user.uid,
    variables: {
      groupPermissionParams: {
        systemObject: 'GROUP',
        userId: user.uid
      }
    }
  })

  if (!user.uid) {
    return {
      loading: false
    }
  }

  if (!data || loading) {
    return {
      loading: true
    }
  }

  const { groupPermissions: groupPermissionsResult } = data
  const { items } = groupPermissionsResult
  const groupPermissionsObject = items.find((item) => item.systemObject === 'GROUP')
  const { permissions: groupPermissions } = groupPermissionsObject

  let hasSystemGroup = false
  if (systemGroup) {
    hasSystemGroup = !!groupPermissions.find((permission) => systemGroup.includes(permission))
  }

  return {
    hasSystemGroup,
    loading: false
  }
}

export default usePermissions
