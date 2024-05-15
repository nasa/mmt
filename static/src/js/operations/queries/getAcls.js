import { gql } from '@apollo/client'

// Query to retrieve acls
export const GET_ACLS = gql`
  query Acls($params: AclsInput) {
    acls(params: $params) {
      count,
      items {
        acl
        groupPermissions
        providerIdentity
      }
    }
  }
`