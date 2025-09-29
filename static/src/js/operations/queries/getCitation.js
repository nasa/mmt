import { gql } from '@apollo/client'

export const GET_CITATION = gql`
  query GetCitation ($params: CitationInput, $collectionsParams: CollectionsInput) {
    citation (params: $params) {
      abstract
      citationMetadata
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
