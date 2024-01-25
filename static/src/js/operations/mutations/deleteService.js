import { gql } from '@apollo/client'

export const DELETE_SERVICE = gql`
  mutation DeleteService (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteService (
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
//   "conceptId": "S1200000096-MMT_2",",
//   "providerId": "MMT_2"
// }
