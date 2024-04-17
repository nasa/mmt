import { gql } from '@apollo/client'

export const GET_ORDER_OPTIONS = gql`
  query OrderOptions($params: OrderOptionsInput) {
    orderOptions(params: $params) {
      count
      items {
        description
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
