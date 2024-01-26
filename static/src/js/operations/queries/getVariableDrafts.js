import { gql } from '@apollo/client'

// Query to retrieve service drafts for listing open drafts
export const GET_VARIABLE_DRAFTS = gql`
  query VariableDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        revisionDate
        previewMetadata {
          ... on Variable {
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
//     "conceptType": "Variable",
//     "limit": 5,
//     "provider": "MMT_2",
//     "sortKey": ["-revision_date"]
//   }
// }
