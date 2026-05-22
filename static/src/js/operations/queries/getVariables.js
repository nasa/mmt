import { gql } from '@apollo/client'

export const GET_VARIABLES = gql`
  query GetVariables($params: VariablesInput) {
    variables(params: $params) {
      count
      cursor
      items {
        conceptId
        name
        type: variableType
        longName
        providerId
        revisionDate
        revisionId
        userId
      }
    }
  }
`
