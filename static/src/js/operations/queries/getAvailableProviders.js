import { gql } from '@apollo/client'

// Query to available providers acls
export const GET_AVAILABLE_PROVIDERS = gql`
  query GetAvailableProviders($params: AclsInput) {
    acls(params: $params) {
      items {
        conceptId
        providerIdentity
      }
    }
  }
`
