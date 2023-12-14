import { gql } from '@apollo/client'

// Query to retrieve draft for download
export const DOWNLOAD_DRAFT = gql`
  query DownloadDraft($params: DraftInput) {
    draft(params: $params) {
      conceptId,
      conceptType,
      ummMetadata
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "TD1200000096-MMT_2",
//     "conceptType": "Tool"
//   }
// }
