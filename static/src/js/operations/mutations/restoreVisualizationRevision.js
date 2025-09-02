import { gql } from '@apollo/client'

export const RESTORE_VISUALIZATION_REVISION = gql`
  mutation RestoreVisualizationRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreVisualizationRevision (
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
//   "conceptId": "VIS1200000098-MMT_2",
//   "revisionId": "1"
// }
