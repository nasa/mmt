import { gql } from '@apollo/client'

export const UPDATE_ORDER_OPTION = gql`
  mutation UpdateOrderOption (
    $deprecated: Boolean
    $description: String
    $form: String
    $name: String
    $nativeId: String!
    $providerId: String!
    $scope: OrderOptionScopeType
    $sortKey: String
  ) {
    updateOrderOption (
      deprecated: $deprecated
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
