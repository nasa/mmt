import { useQuery } from '@apollo/client'

import { getApplicationConfig } from 'sharedUtils/getConfig'
import { GET_PERMISSIONS } from '@/js/operations/queries/getPermissions'
import useAuthContext from './useAuthContext'

/**
 * Requests the provided permissions from CMR
 * @param {Object} params Object containing permissions to check
 * @param {Array} params.systemGroup Array of permissions to check in the system object 'GROUP'
 * @param {Array} params.systemKeywords Array of permissions to check in the system object 'KEYWORDS'
 * @returns {Object} Object that has the loading state, and a boolean for the requested permissions
 */
const usePermissions = ({
  systemGroup,
  systemKeywords,
  providerPermissionParams
} = {}) => {
  const { env } = getApplicationConfig()
  const { user } = useAuthContext()
  const { uid } = user || {}

  const shouldCheckGroup = Array.isArray(systemGroup) && systemGroup.length > 0
  const shouldCheckKeywords = Array.isArray(systemKeywords) && systemKeywords.length > 0
  const shouldCheckProviderPermissions = Boolean(providerPermissionParams)
  const shouldQuery = shouldCheckGroup || shouldCheckKeywords || shouldCheckProviderPermissions

  const { data, loading } = useQuery(GET_PERMISSIONS, {
    skip: !uid || !shouldQuery,
    variables: {
      groupPermissionParams: shouldCheckGroup ? {
        systemObject: 'GROUP',
        userId: uid
      } : null,
      keywordsPermissionParams: shouldCheckKeywords ? {
        systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
        userId: uid
      } : null,
      providerPermissionParams: shouldCheckProviderPermissions ? {
        ...providerPermissionParams,
        userId: uid
      } : null
    }
  })

  if (!uid || !shouldQuery) {
    return {
      hasSystemGroup: false,
      hasSystemKeywords: false,
      hasProviderPermissions: !shouldCheckProviderPermissions,
      loading: false
    }
  }

  if (!data || loading) {
    return {
      loading: true
    }
  }

  const {
    groupPermissions: groupPermissionsResult = {},
    keywordsPermissions: keywordsPermissionsResult = {},
    providerPermissions: providerPermissionsResult = {}
  } = data

  const { items: groupItems = [] } = groupPermissionsResult
  const { items: keywordItems = [] } = keywordsPermissionsResult
  const { items: providerPermissionItems = [] } = providerPermissionsResult

  const groupPermissionsObject = groupItems.find((groupItem) => groupItem.systemObject === 'GROUP')
  const keywordsPermissionsObject = keywordItems.find((keywordItem) => keywordItem.systemObject === 'KEYWORD_MANAGEMENT_SYSTEM')

  const { permissions: groupPermissions = [] } = groupPermissionsObject || {}
  const { permissions: keywordsPermissions = [] } = keywordsPermissionsObject || {}

  let hasSystemGroup = false
  if (shouldCheckGroup) {
    hasSystemGroup = !!groupPermissions.find((permission) => systemGroup.includes(permission))
  }

  let hasSystemKeywords = false
  if (shouldCheckKeywords) {
    hasSystemKeywords = !!keywordsPermissions?.find((permission) => (
      systemKeywords.includes(permission)
    ))

    if (env === 'development') {
      hasSystemKeywords = true
    }
  }

  let hasProviderPermissions = true
  if (shouldCheckProviderPermissions) {
    hasProviderPermissions = providerPermissionItems.length > 0
  }

  return {
    hasSystemGroup,
    hasSystemKeywords,
    hasProviderPermissions,
    loading: false
  }
}

export default usePermissions
