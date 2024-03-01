import { gql } from '@apollo/client'

export const GET_COLLECTIONS = gql`
  query GetCollections($params: CollectionsInput) {
    collections(params: $params) {
      count
      items {
        conceptId
        shortName
        version
        title
        provider
        entryTitle
        granules {
          count
        }
        tags
        revisionDate
      }
    }
  }
`