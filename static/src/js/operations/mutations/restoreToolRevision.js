import { gql } from '@apollo/client'

export const RESTORE_TOOL_REVISION = gql`
  mutation RestoreToolRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreToolRevision (
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
//   "conceptId": "T1200000098-MMT_2",
//   "revisionId": "1"
// }
