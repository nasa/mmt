import { gql } from '@apollo/client'

export const RESTORE_COLLECTION_REVISION = gql`
  mutation RestoreCollectionRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreCollectionRevision (
      conceptId: $conceptId
      revisionId: $revisionId
    ) {
      conceptId
      revisionId
    }
  }
`
// Example Variables:
// {
//   "conceptId": "C1200000098-MMT_2",
//   "revisionId": "1"
// }
