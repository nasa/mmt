import { gql } from '@apollo/client'

export const CREATE_ACL = gql`
  mutation CreateAcl(
    $catalogItemIdentity: JSON,
    $groupPermissions: JSON!,
    $providerIdentity: JSON,
    $systemIdentity: JSON
  ) {
    createAcl(
      catalogItemIdentity: $catalogItemIdentity
      groupPermissions: $groupPermissions,
      providerIdentity: $providerIdentity,
      systemIdentity: $systemIdentity
    ) {
      revisionId
      conceptId
    }
  }`
