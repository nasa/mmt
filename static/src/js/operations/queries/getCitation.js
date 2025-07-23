import { gql } from '@apollo/client'

export const GET_CITATION = gql`
  query GetCitation ($params: CitationInput) {
    citation (params: $params) {
      abstract
      citationMetadata
      conceptId
      identifier
      identifierType
      name
      nativeId
      providerId
      relatedIdentifiers
      resolutionAuthority
      revisionDate
      revisionId
      revisions {
        count
        items {
          conceptId
          revisionDate
          revisionId
          userId
        }
      }
      scienceKeywords
      ummMetadata
      userId
    }
  }
`
