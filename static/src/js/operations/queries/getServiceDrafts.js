import { gql } from '@apollo/client'

// Query to retrieve service drafts for listing open drafts
export const GET_SERVICE_DRAFTS = gql`
  query ServiceDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        revisionDate
        previewMetadata {
          ... on Service {
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
//     "conceptType": "Service",
//     "limit": 5,
//     "provider": "MMT_2",
//     "sortKey": ["-revision_date"]
//   }
// }
