import { gql } from '@apollo/client'

export const GET_VARIABLES = gql`
  query GetVariables($params: VariablesInput) {
    variables(params: $params) {
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
