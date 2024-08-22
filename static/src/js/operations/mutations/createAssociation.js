import { gql } from '@apollo/client'

export const CREATE_ASSOCIATION = gql`
  mutation CreateAssociation (
    $conceptId: String!
    $associatedConceptIds: [String]
    $associatedConceptData: JSON
  ) {
    createAssociation (
      conceptId: $conceptId
      associatedConceptIds: $associatedConceptIds
      associatedConceptData: $associatedConceptData
    ) {
      associatedConceptId
      conceptId
      revisionId
    }
  }
`
