import { gql } from '@apollo/client'

export const DELETE_ASSOCIATION = gql`
  mutation DeleteAssociation(
    $conceptId: String!
    $associatedConceptIds: [String]
  ) {
    deleteAssociation(
      conceptId: $conceptId
      associatedConceptIds: $associatedConceptIds
    ) {
      revisionId
      conceptId
      associatedConceptId
    }
  }
`
