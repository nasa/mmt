import { gql } from '@apollo/client'

export const GET_COLLECTION_PERMISSIONS = gql`
  query GetCollectionPermissions($params: AclsInput) {
    acls(params: $params) {
      count
      items {
        name
        conceptId
        catalogItemIdentity {
          providerId
        }
      }
    }
  }
`
