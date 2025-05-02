import { gql } from '@apollo/client'

export const GET_VISUALIZATION = gql`
  query GetVisualization ($params: VisualizationInput) {
    visualization (params: $params) {
      conceptId
      description
      generation
      identifier
      metadataSpecification
      name
      nativeId
      providerId
      revisionDate
      revisionId
      revisions {
        count
        items {
          conceptId
          revisionDate
          revisionId
          # userId
        }
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
