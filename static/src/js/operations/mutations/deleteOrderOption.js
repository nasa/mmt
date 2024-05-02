import { gql } from '@apollo/client'

export const DELETE_ORDER_OPTION = gql`
  mutation DeleteOrderOption (
    $nativeId: String!
    $providerId: String!
  ) {
    deleteOrderOption (
      nativeId: $nativeId
      providerId: $providerId
    ) {
      conceptId
      revisionId
    }
  }
`
// Example Variables:
// {
//   "nativeId": "1234-abcd-5678-efgh",
//   "providerId": MMT_2,
// }
