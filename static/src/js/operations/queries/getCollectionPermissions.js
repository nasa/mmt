import { gql } from '@apollo/client'

export const GET_COLLECTION_PERMISSIONS = gql`
  query Acls($params: AclsInput) {
    acls(params: $params) {
      count
      items {
        name
        conceptId
      }
    }
  }
`
