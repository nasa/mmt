import { gql } from '@apollo/client'

// Query to delete a draft
export const DELETE_DRAFT = gql`
  mutation DeleteDraft (
    $conceptType: DraftConceptType!
    $nativeId: String!
    $providerId: String!
  ) {
    deleteDraft (
      conceptType: $conceptType
      nativeId: $nativeId
      providerId: $providerId
    ) {
      conceptId
      revisionId
    }
  }
`

// Example Variables:
// {
//   "conceptType": "Tool",
//   "nativeId": "tool-3",
//   "providerId": "MMT_2"
// }
