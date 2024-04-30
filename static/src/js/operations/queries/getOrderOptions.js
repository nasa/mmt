import { gql } from '@apollo/client'

export const GET_ORDER_OPTIONS = gql`
  query GetOrderOptions($params: OrderOptionsInput) {
    orderOptions(params: $params) {
      count
      items {
        description,
        deprecated
        conceptId
        name
        form
        nativeId
        scope
        sortKey
        associationDetails
        revisionDate
      }
    }
  }
`
