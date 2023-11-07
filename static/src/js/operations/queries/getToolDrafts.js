import { gql } from '@apollo/client'

// Query to retrieve tool drafts for listing open drafts
export const GET_TOOL_DRAFTS = gql`
  query Drafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        revisionDate
        previewMetadata {
          ... on Tool {
            name
            longName
          }
        }
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptType": "Tool",
//     "limit": 5,
//     "provider": "MMT_2",
//     "sortKey": ["-revision_date"]
//   }
// }
