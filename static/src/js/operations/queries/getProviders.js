import { gql } from '@apollo/client'

export const GET_PROVIDERS = gql`
  query Providers {
    providers {
      count
      items {
        providerId
        shortName
      }
    }
  }
`
