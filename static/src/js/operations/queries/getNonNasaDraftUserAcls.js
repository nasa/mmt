import { gql } from '@apollo/client'

// Query to available providers acls
export const GET_NON_NASA_DRAFT_USER_ACLS = gql`
  query GetNonNasaDraftUserAcls($params: AclsInput) {
    acls(params: $params) {
      items {
        name
      }
    }
  }
`
