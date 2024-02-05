import { gql } from '@apollo/client'

// Query to retrieve collection drafts for listing open drafts
export const GET_COLLECTION_DRAFTS = gql`
  query CollectionDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        revisionDate
        ummMetadata
      }
    }
  }
`
