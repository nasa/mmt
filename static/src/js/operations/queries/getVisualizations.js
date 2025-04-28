import { gql } from '@apollo/client'

export const GET_VISUALIZATIONS = gql`
  query GetVisualizations($params: VisualizationsInput) {
    visualizations(params: $params) {
      count
      items {
        conceptId
        revisionId
        name
        title
        providerId
        revisionDate
      }
    }
  }
`
