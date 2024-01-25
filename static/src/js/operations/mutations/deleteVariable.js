import { gql } from '@apollo/client'

export const DELETE_VARIABLE = gql`
  mutation DeleteVariable (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteVariable (
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
//   "conceptId": "V1200000096-MMT_2",",
//   "providerId": "MMT_2"
// }
