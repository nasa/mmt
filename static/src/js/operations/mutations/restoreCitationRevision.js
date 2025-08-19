import { gql } from '@apollo/client'

export const RESTORE_CITATION_REVISION = gql`
  mutation RestoreCitationRevision (
    $conceptId: String!
    $revisionId: String!
  ) {
    restoreCitationRevision (
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
//   "conceptId": "CIT1200000098-MMT_2",
//   "revisionId": "1"
// }
