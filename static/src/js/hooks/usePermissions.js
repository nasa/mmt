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
  providerIdentityTargets
} = {}) => {
  const { env } = getApplicationConfig()
  const { user } = useAuthContext()
  const { uid } = user || {}

  const shouldCheckGroup = Array.isArray(systemGroup) && systemGroup.length > 0
  const shouldCheckKeywords = Array.isArray(systemKeywords) && systemKeywords.length > 0
  const shouldCheckProviderIdentities = Array.isArray(providerIdentityTargets) && providerIdentityTargets.length > 0
  const shouldQuery = shouldCheckGroup || shouldCheckKeywords || shouldCheckProviderIdentities

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
      providerIdentityParams: shouldCheckProviderIdentities ? {
        limit: 2000,
        permittedUser: uid,
        target: providerIdentityTargets[0]
      } : null
    }
  })

  if (!uid || !shouldQuery) {
    return {
      hasSystemGroup: false,
      hasSystemKeywords: false,
      hasProviderIdentities: !shouldCheckProviderIdentities,
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
    providerIdentityAcls
  } = data

  const { items: groupItems = [] } = groupPermissionsResult
  const { items: keywordItems = [] } = keywordsPermissionsResult
  const providerIdentityItems = providerIdentityAcls?.items || []

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

  let hasProviderIdentities = true
  if (shouldCheckProviderIdentities) {
    hasProviderIdentities = providerIdentityItems.some(
      (acl) => providerIdentityTargets.includes(acl?.target)
    )
  }

  return {
    hasSystemGroup,
    hasSystemKeywords,
    hasProviderIdentities,
    loading: false
  }
}

export default usePermissions
