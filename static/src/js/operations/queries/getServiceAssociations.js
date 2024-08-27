import { gql } from '@apollo/client'

export const GET_SERVICE_ASSOCIATIONS = gql`
  query GetServiceAssociations ($params: CollectionInput) {
    collection (params: $params) {
      conceptId
      shortName
      services {
        count
        items {
          conceptId
          longName
          orderOptions {
            count
            items {
              name
              conceptId
            }
          }
        }
      }
    }
  }
`
