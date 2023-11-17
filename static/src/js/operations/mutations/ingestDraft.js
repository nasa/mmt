import { gql } from '@apollo/client'

// Query to delete a draft
export const INGEST_DRAFT = gql`
  mutation IngestDraft (
    $conceptType: DraftConceptType!
    $metadata: JSON!
    $nativeId: String!
    $providerId: String!
    $ummVersion: String!
  ) {
    ingestDraft (
      conceptType: $conceptType
      metadata: $metadata
      nativeId: $nativeId
      providerId: $providerId
      ummVersion: $ummVersion
    ) {
      conceptId
      # revisionId
      # warnings
      # existingErrors
    }
  }
`

// Example Variables:
// {
//   "conceptType": "Tool",
//   "metadata": {},
//   "nativeId": "tool-0",
//   "providerId": "MMT_2",
//   "ummVersion": "1.0.0"
// }
