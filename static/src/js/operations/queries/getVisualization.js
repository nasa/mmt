import { gql } from '@apollo/client'

export const GET_VISUALIZATION = gql`
  query GetVisualization ($params: VisualizationInput) {
    visualization (params: $params) {
      conceptId
      description
      generation
      identifier
      metadataSpecification
      pageTitle: name
      nativeId
      providerId
      revisionDate
      revisionId
      revisions {
        count
      }
      scienceKeywords
      spatialExtent
      specification
      subtitle
      temporalExtent
      title
      ummMetadata
      visualizationType
    }
  }
`
