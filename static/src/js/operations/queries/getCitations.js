import { gql } from '@apollo/client'

export const GET_CITATIONS = gql`
  query GetCitation($params: CitationsInput) {
    citations(params: $params) {
      count
      items {
        conceptId
        revisionId
        name
        providerId
        revisionDate
        citationMetadata
      }
    }
  }
`
