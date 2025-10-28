import { gql } from '@apollo/client'

export const GET_GRANULES = gql`
  query GetGranules ($params: CollectionInput) {
    collection (params: $params) {
      granules {
        count
        items {
          conceptId
          title
          revisionDate
        }
      }
      shortName
    }
  }
`
