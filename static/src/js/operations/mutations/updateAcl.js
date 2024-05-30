import { gql } from '@apollo/client'

export const UPDATE_ACL = gql`
  mutation UpdateAcl(
    $conceptId: String!,
    $groupPermissions: JSON,
    $providerIdentity: JSON,
    $systemIdentity: JSON
  ) {
    updateAcl(
      conceptId: $conceptId,
      groupPermissions: $groupPermissions,
      providerIdentity: $providerIdentity,
      systemIdentity: $systemIdentity
    ) {
      conceptId
      revisionId
    }
  }`
