import { gql } from '@apollo/client'

// Used by SaveAsDraftToExistingCollectionModal to fetch just enough of a
// published collection -- its nativeId/providerId (the save target) and
// ummMetadata (diffed against the staged metadata) -- once a ShortName
// search has resolved to a single candidate. Deliberately narrower than
// GET_COLLECTION, which also requests related resources (citations,
// granules, services, tools, etc.) this flow doesn't need.
export const GET_TARGET_COLLECTION = gql`
  query GetTargetCollection ($params: CollectionInput) {
    collection (params: $params) {
      nativeId
      providerId: provider
      ummMetadata
    }
  }
`
