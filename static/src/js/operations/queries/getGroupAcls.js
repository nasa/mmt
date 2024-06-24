import { gql } from '@apollo/client'

export const GET_GROUP_ACLS = gql`
  query GetGroupAcls (
    $params: GroupInput,
    $aclParams: GroupAclsInput
  ) {
    group (
      params: $params
    ) {
      id
      acls(params: $aclParams) {
        count
        items {
          name
          catalogItemIdentity {
            providerId
          }
          conceptId
        }
      }
    }
  }
`
