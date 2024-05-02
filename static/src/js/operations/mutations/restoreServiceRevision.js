import { gql } from '@apollo/client'

export const RESTORE_SERVICE_REVISION = gql`
  mutation RestoreServiceRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreServiceRevision (
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
//   "conceptId": "S1200000098-MMT_2",
//   "revisionId": "1"
// }
