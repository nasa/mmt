import { gql } from '@apollo/client'

export const PUBLISH_DRAFT = gql`
  mutation PublishDraft (
    $draftConceptId: String!
    $nativeId: String!
    $ummVersion: String!
  ) {
    publishDraft (
      draftConceptId: $draftConceptId
      nativeId: $nativeId
      ummVersion: $ummVersion
    ) {
      conceptId
      revisionId
    }
  }
`
// Example Variables:
// {
//   "draftConceptId": "TD1200000-MMT_2",
//   "nativeId": "publish native id",
//   "ummVersion": "1.0.0"
// }
