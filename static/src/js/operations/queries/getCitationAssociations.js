import { gql } from '@apollo/client'

export const GET_CITATION_ASSOCIATIONS = gql`
  query GetCitationAssociations ($params: CollectionInput, $citationParams: CitationsInput) {
    collection (params: $params) {
      conceptId
      shortName
      citations (params: $citationParams) {
        count
        items {
          conceptId
          name
          identifier
          identifierType
          providerId
        }
      }
    }
  }
`
