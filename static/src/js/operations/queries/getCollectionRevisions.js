import { gql } from '@apollo/client'

export const GET_COLLECTION_REVISIONS = gql`
  query GetCollectionRevisions($params: CollectionsInput) {
    collections(params: $params) {
      count
      items {
        conceptId
        shortName
        version
        title
        revisionId
        revisionDate
        userId
      }
    }
  }
`
