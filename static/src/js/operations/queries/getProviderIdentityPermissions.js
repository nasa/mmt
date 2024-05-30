import { gql } from '@apollo/client'

export const GET_PROVIDER_IDENTITY_PERMISSIONS = gql`
  query GetProviderIdentityPermissions($params: AclsInput) {
    acls(params: $params) {
      items {
        conceptId
        groups {
          items {
            id
            permissions
            userType
          }
        }
        providerIdentity
      }
    }
  }
`
