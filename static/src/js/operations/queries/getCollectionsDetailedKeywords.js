import { gql } from '@apollo/client'

// Both scienceKeywords and locationKeywords are requested unconditionally -- a given bulk
// update only touches one, but both are small enough that a single query is simpler than
// two near-identical ones. See findDetailedKeywordLosses.js for how these are used.
export const GET_COLLECTIONS_DETAILED_KEYWORDS = gql`
  query GetCollectionsDetailedKeywords($params: CollectionsInput) {
    collections(params: $params) {
      items {
        conceptId
        shortName
        version
        scienceKeywords
        locationKeywords
      }
    }
  }
`
