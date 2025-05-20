import { gql } from '@apollo/client'

export const GET_VISUALIZATION = gql`
  query GetVisualization ($params: VisualizationInput) {
    visualization (params: $params) {
      conceptId
      description
      generation
      identifier
      metadataSpecification
      name,
      pageTitle: name
      nativeId
      providerId
      revisionDate
      revisionId
      revisions {
        count
      }
      collections {
        count
        items {
          conceptId
          title
        }
      }
      scienceKeywords
      spatialExtent
      specification
      subtitle
      temporalExtents
      title
      ummMetadata
      visualizationType
    }
  }
`
