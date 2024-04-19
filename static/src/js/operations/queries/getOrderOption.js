import { gql } from '@apollo/client'

export const GET_ORDER_OPTION = gql`
  query OrderOption($params: OrderOptionInput) {
    orderOption(params: $params) {
      conceptId
      deprecated
      description
      form
      name
      nativeId
      revisionDate
      scope
      sortKey
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "OO1200000096-MMT_2",
//   }
// }
