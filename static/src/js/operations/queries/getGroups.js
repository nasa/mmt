import { gql } from '@apollo/client'

export const GET_GROUPS = gql`
  query Groups (
    $params: GroupsInput
  ) {
    groups (
      params: $params
    ) {
      count
      items {
        description
        id
        members {
          count
        }
        name
        tag
      }
    }
  }
`
