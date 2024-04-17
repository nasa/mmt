import { gql } from '@apollo/client'

export const GET_SERVICES = gql`
  query GetServices($params: ServicesInput) {
    services(params: $params) {
      count
      items {
        conceptId
        name
        longName
        providerId
        revisionDate
        revisionId
        userId
      }
    }
  }
`
