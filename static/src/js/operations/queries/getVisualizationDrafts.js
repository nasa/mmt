import { gql } from '@apollo/client'

export const GET_VISUALIZATION_DRAFTS = gql`
  query VaisualizationDrafts($params: DraftsInput) {
    drafts(params: $params) {
      count
      items {
        conceptId
        providerId
        revisionDate
        ummMetadata
        previewMetadata {
          ... on Visualization {
            conceptId
            name
            title
          }
        }
      }
    }
  }
`
