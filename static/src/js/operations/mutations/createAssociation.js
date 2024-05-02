import { gql } from '@apollo/client'

export const CREATE_ASSOCIATION = gql`
  mutation CreateAssociation (
    $conceptId: String!
    $associatedConceptIds: [String]!
  ) {
    createAssociation (
      conceptId: $conceptId
      associatedConceptIds: $associatedConceptIds
    ) {
      associatedConceptId
      conceptId
      revisionId
    }
  }
`
