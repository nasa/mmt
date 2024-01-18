import { gql } from '@apollo/client'

export const DELETE_TOOL = gql`
  mutation DeleteTool (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteTool (
      providerId: $providerId
      nativeId: $nativeId
    ) {
      conceptId
      revisionId
    }
  }
`

// Example Variables:
// {
//   "conceptId": "T1200000096-MMT_2",",
//   "providerId": "MMT_2"
// }
