import { useQuery } from '@apollo/client'

import useAuthContext from './useAuthContext'

import { GET_PERMISSIONS } from '../operations/queries/getPermissions'
import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

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
  const { env } = getApplicationConfig()
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
        systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
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
  const keywordsPermissionsObject = keywordItems.find((keywordItem) => keywordItem.systemObject === 'KEYWORD_MANAGEMENT_SYSTEM')

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

    if (env === 'development') {
      hasSystemKeywords = true
    }
  }

  return {
    hasSystemGroup,
    hasSystemKeywords,
    loading: false
  }
}

export default usePermissions
