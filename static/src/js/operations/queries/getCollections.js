import { gql } from '@apollo/client'

export const GET_COLLECTIONS = gql`
  query Collections($params: CollectionsInput) {
    collections(params: $params) {
      items {
        conceptId
        provider
        version
        shortName
        title
      }
      count
    }
  }
`
