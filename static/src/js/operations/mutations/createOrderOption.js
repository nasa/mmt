import { gql } from '@apollo/client'

export const CREATE_ORDER_OPTION = gql`
  mutation CreateOrderOption (
    $providerId: String!
    $description: String
    $form: String
    $nativeId: String
    $name: String
    $scope: OrderOptionScopeType
    $sortKey: String
  ) {
    createOrderOption (
      providerId: $providerId
      description: $description
      form: $form
      nativeId: $nativeId
      name: $name
      scope: $scope
      sortKey: $sortKey
    ) {
      conceptId
      revisionId
    }
  }
`
// Example Variables:
// {
//    "providerId": "MMT_2",
//    "description": "Order Option Description",
//    "form": "<><>",
//    "nativeId": "MMT_1234-abcd-5678",
//    "name": "Order Option 1",
//    "scope": "PROVIDER",
// }
