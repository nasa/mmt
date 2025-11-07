import { gql } from '@apollo/client'

export const GET_GRANULES = gql`
  query GetCollection($params: CollectionInput, $granulesParams: GranulesInput) {
    collection (params: $params) {
      granules (params: $granulesParams) {
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
