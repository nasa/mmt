import { gql } from '@apollo/client'

export const GET_PERMISSIONS = gql`
  query Permissions(
    $groupPermissionParams: PermissionsInput
    $keywordsPermissionParams: PermissionsInput
    $providerPermissionParams: PermissionsInput
  ) {
    groupPermissions: permissions(params: $groupPermissionParams) {
      count
      items {
        systemObject
        permissions
      }
    }
    keywordsPermissions: permissions(params: $keywordsPermissionParams) {
      count
      items {
        systemObject
        permissions
      }
    }
    providerPermissions: permissions(params: $providerPermissionParams) {
      count
      items {
        conceptId
        systemObject
        target
        permissions
      }
    }
  }
`
