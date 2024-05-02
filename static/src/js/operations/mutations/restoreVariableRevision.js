import { gql } from '@apollo/client'

export const RESTORE_VARIABLE_REVISION = gql`
  mutation RestoreVariableRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreVariableRevision (
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
//   "conceptId": "V1200000098-MMT_2",
//   "revisionId": "1"
// }
