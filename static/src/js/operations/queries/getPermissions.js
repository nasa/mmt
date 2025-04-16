import { gql } from '@apollo/client'

export const GET_PERMISSIONS = gql`
  query Permissions(
    $groupPermissionParams: PermissionsInput
    $keywordsPermissionParams: PermissionsInput
    # $otherParams: PermissionsInput
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

    # Example: can add more permissions checks into this query and pass separate params in the future if we need to
    # otherPermissions: permissions(params: $otherParams) {
    #   count
    #   items {
    #     systemObject
    #     permissions
    #     target
    #   }
    # }

    # Alternatively, use the acls query to return all permissions for a user
  }
`
