import { gql } from '@apollo/client'

// Query to retrieve citation drafts for listing open drafts
export const GET_CITATION_DRAFTS = gql`
  query CitationDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        providerId
        revisionDate
        ummMetadata
        previewMetadata {
          ... on Citation {
            name
          }
        }
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptType": "Citation",
//     "limit": 5,
//     "provider": "MMT_2",
//     "sortKey": ["-revision_date"]
//   }
// }
