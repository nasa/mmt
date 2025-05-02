import { gql } from '@apollo/client'

export const DELETE_VISUALIZATION = gql`
  mutation DeleteVisualization (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteVisualization (
      providerId: $providerId
      nativeId: $nativeId
    ) {
      conceptId
      revisionId
    }
  }
`

// Example Visualizations:
// {
//   "conceptId": "V1S200000096-MMT_2",",
//   "providerId": "MMT_2"
// }
