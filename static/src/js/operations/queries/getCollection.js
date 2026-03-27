import { gql } from '@apollo/client'

export const GET_COLLECTION = gql`
  query GetCollection($params: CollectionInput, $variableParams: VariablesInput) {
    collection(params: $params) {
      citations {
        count
        items {
          conceptId
          name
          type: identifierType
        }
      }
      conceptId
      services {
        count
        items {
          conceptId
          description
          name
          type
          longName
          url
        }
      }
      shortName
      title
      tools {
        count
        items {
          conceptId
          name
          description
          type
          url
        }
      }
      variables(params: $variableParams) {
        count
        cursor
        items {
          conceptId
          name
        }
      }
      visualizations {
        count
        items {
          conceptId
          name
          type: visualizationType
        }
      }
    }
  }
`
