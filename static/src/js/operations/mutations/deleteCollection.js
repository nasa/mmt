import { gql } from '@apollo/client'

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection (
    $providerId: String!
    $nativeId: String!
  ) {
    deleteCollection (
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
//   "conceptId": "VC1200000096-MMT_2",",
//   "providerId": "MMT_2"
// }
