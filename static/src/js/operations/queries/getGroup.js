import { gql } from '@apollo/client'

export const GET_GROUP = gql`
  query Group (
    $params: GroupInput
  ) {
    group (
      params: $params
    ) {
      description
      id
      name
      members {
        count
        items {
          id
          firstName
          lastName
          emailAddress
        }
      }
      tag
    }
  }
`
