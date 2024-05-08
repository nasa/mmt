import { gql } from '@apollo/client'

export const DELETE_GROUP = gql`
  mutation DeleteGroup (
    $id: String!
  ) {
    deleteGroup (
      id: $id
    )
  }
`
