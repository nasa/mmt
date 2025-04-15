import { useQuery } from '@apollo/client'

import useAuthContext from './useAuthContext'

import { GET_PERMISSIONS } from '../operations/queries/getPermissions'

/**
 * Requests the provided permissions from CMR
 * @param {Object} params Object containing permissions to check
 * @param {Array} params.systemGroup Array of permissions to check in the system object 'GROUP'
 * @param {Array} params.systemKeywords Array of permissions to check in the system object 'KEYWORDS'
 * @returns {Object} Object that has the loading state, and a boolean for the requested permissions
 */
const usePermissions = ({
  systemGroup,
  systemKeywords
}) => {
  const { user } = useAuthContext()
  const { uid } = user || {}

  const { data, loading } = useQuery(GET_PERMISSIONS, {
    skip: !uid,
    variables: {
      groupPermissionParams: {
        systemObject: 'GROUP',
        userId: uid
      },
      keywordsPermissionParams: {
        // Change to correct systemObject CMR-10452 is complete
        systemObject: 'INGEST_MANAGEMENT_ACL',
        userId: uid
      }
    }
  })

  if (!uid) {
    return {
      loading: false
    }
  }

  if (!data || loading) {
    return {
      loading: true
    }
  }

  const {
    groupPermissions: groupPermissionsResult,
    keywordsPermissions: keywordsPermissionsResult
  } = data

  const { items: groupItems } = groupPermissionsResult
  const { items: keywordItems } = keywordsPermissionsResult

  const groupPermissionsObject = groupItems.find((groupItem) => groupItem.systemObject === 'GROUP')
  const keywordsPermissionsObject = keywordItems.find((keywordItem) => keywordItem.systemObject === 'INGEST_MANAGEMENT_ACL' || keywordItem.systemObject === 'GROUP')
  // Remove the line above and comment in the line below and change to correct string when CMR-10452 is done
  // const keywordsPermissionsObject = keywordItems.find((keywordItem) => keywordItem.systemObject === 'INGEST_MANAGEMENT_ACL')

  const { permissions: groupPermissions } = groupPermissionsObject || {}
  const { permissions: keywordsPermissions } = keywordsPermissionsObject || {}

  let hasSystemGroup = false
  if (systemGroup) {
    hasSystemGroup = !!groupPermissions.find((permission) => systemGroup.includes(permission))
  }

  let hasSystemKeywords = false
  if (systemKeywords) {
    hasSystemKeywords = !!keywordsPermissions?.find((permission) => (
      systemKeywords.includes(permission)
    ))
  }

  return {
    hasSystemGroup,
    hasSystemKeywords,
    loading: false
  }
}

export default usePermissions
