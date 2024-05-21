import { gql } from '@apollo/client'

export const CREATE_ACL = gql`
  mutation CreateAcl(
    $groupPermissions: JSON!,
    $systemIdentity: JSON
  ) {
    createAcl(
      groupPermissions: $groupPermissions,
      systemIdentity: $systemIdentity
    ) {
      revisionId
      conceptId
    }
  }`
