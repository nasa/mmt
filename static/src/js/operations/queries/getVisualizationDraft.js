import { gql } from '@apollo/client'

export const VISUALIZATION_DRAFT = gql`
  query VisualizationDraft($params: DraftInput) {
    draft(params: $params) {
      conceptId
      conceptType
      deleted
      name
      nativeId
      providerId
      revisionDate
      revisionId
      previewMetadata {
        ... on Visualization {
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
      ummMetadata
    }
  }
`
