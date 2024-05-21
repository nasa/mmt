import { gql } from '@apollo/client'

export const UPDATE_ACL = gql`
  mutation UpdateAcl(
    $conceptId: String!,
    $groupPermissions: JSON,
    $systemIdentity: JSON
  ) {
    updateAcl(
      conceptId: $conceptId,
      groupPermissions: $groupPermissions,
      systemIdentity: $systemIdentity
    ) {
      conceptId
      revisionId
    }
  }`
