import { gql } from '@apollo/client'

// Query to retrieve variable drafts for listing open drafts
export const GET_VARIABLE_DRAFTS = gql`
  query VariableDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        revisionId
        providerId
        revisionDate
        ummMetadata
        previewMetadata {
          ... on Variable {
            conceptId
            revisionId
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
