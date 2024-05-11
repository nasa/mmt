import { gql } from '@apollo/client'

export const GET_SYSTEM_IDENTITY_PERMISSIONS = gql`
  query GetSystemSystemPermissions($params: AclsInput) {
    acls(params: $params) {
      items {
        systemIdentity
        groupPermissions
        conceptId
      }
    }
  }
`
