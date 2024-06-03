import { gql } from '@apollo/client'

export const UPDATE_ACL = gql`
  mutation UpdateAcl(
    $catalogItemIdentity: JSON,
    $conceptId: String!,
    $groupPermissions: JSON,
    $providerIdentity: JSON,
    $systemIdentity: JSON
  ) {
    updateAcl(
      catalogItemIdentity: $catalogItemIdentity
      conceptId: $conceptId,
      groupPermissions: $groupPermissions,
      providerIdentity: $providerIdentity,
      systemIdentity: $systemIdentity
    ) {
      conceptId
      revisionId
    }
  }`
