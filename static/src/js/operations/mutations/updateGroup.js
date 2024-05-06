import { gql } from '@apollo/client'

export const UPDATE_GROUP = gql`
  mutation UpdateGroup (
    $id: String!
    $description: String
    $members: String
    $name: String
    $tag: String
  ) {
    updateGroup (
      id: $id
      description: $description
      members: $members
      name: $name
      tag: $tag
    ) {
      appUid
      clientId
      createdBy
      description
      id
      members {
        count
        items {
          id
          emailAddress
        }
      }
      name
      sharedUserGroup
      tag
    }
  }
`
