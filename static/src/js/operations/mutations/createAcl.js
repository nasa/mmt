import { gql } from '@apollo/client'

export const CREATE_ACL = gql`
  mutation CreateAcl(
    $groupPermissions: JSON!,
    $providerIdentity: JSON,
    $systemIdentity: JSON
  ) {
    createAcl(
      groupPermissions: $groupPermissions,
      providerIdentity: $providerIdentity,
      systemIdentity: $systemIdentity
    ) {
      revisionId
      conceptId
    }
  }`
