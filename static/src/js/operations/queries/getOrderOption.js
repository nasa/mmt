import { gql } from '@apollo/client'

export const GET_ORDER_OPTION = gql`
  query GetOrderOption($params: OrderOptionInput, $collectionsParams: CollectionsInput) {
    orderOption(params: $params) {
      associationDetails
      conceptId
      deprecated
      description
      form
      name
      nativeId
      pageTitle: name
      revisionId
      revisionDate
      scope
      sortKey
      collections (params: $collectionsParams) {
        count
        items {
          title
          conceptId
          entryTitle
          shortName
          version
          provider
          revisionId
        }
      }
    }
  }
`
