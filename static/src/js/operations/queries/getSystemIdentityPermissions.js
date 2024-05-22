import { gql } from '@apollo/client'

export const GET_SYSTEM_IDENTITY_PERMISSIONS = gql`
  query GetSystemIdentityPermissions($params: AclsInput) {
    acls(params: $params) {
      items {
        conceptId
        groups {
          items {
            id
            permissions
          }
        }
        systemIdentity
      }
    }
  }
`
