import { gql } from '@apollo/client'

export const GET_VISUALIZATION = gql`
  query GetVisualization ($params: VisualizationInput, $collectionsParams: CollectionsInput) {
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
      collections (params: $collectionsParams) {
        count
        items {
          conceptId
          provider
          shortName
          title
          version
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
