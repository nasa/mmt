import { gql } from '@apollo/client'

export const CITATION_DRAFT = gql`
  query CitationDraft($params: DraftInput) {
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
        ... on Citation {
          abstract
          citationMetadata
          conceptId
          identifier
          identifierType
          pageTitle: name
          nativeId
          providerId
          relatedIdentifiers
          resolutionAuthority
          revisionDate
          revisionId
          scienceKeywords
          userId
        }
      }
      ummMetadata
    }
  }
`
