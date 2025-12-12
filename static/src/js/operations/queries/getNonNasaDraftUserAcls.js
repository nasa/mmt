import { gql } from '@apollo/client'

// Query to get non nasa draft user acls
export const GET_NON_NASA_DRAFT_USER_ACLS = gql`
  query GetNonNasaDraftUserAcls($params: AclsInput) {
    acls(params: $params) {
      items {
        name
      }
    }
  }
`
