import { gql } from '@apollo/client'

// Query to available providers acls
export const GET_AVAILABLE_PROVIDERS = gql`
  query AvailableProviders($params: AclsInput) {
    acls(params: $params) {
      items {
        providerIdentity
      }
    }
  }
`
