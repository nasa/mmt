import { gql } from '@apollo/client'

export const GET_TOOLS = gql`
  query GetTools($params: ToolsInput) {
    tools(params: $params) {
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
