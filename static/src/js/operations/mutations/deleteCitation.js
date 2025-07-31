import { gql } from '@apollo/client'

export const DELETE_CITATION = gql`
  mutation DeleteCitation (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteCitation (
      providerId: $providerId
      nativeId: $nativeId
    ) {
      conceptId
      revisionId
    }
  }
`
