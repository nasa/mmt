import { gql } from '@apollo/client'

export const CREATE_GROUP = gql`
  mutation CreateGroup (
    $description: String
    $members: String
    $name: String!
    $tag: String
  ) {
    createGroup (
      description: $description
      members: $members
      name: $name
      tag: $tag
    ) {
      description
      id
      name
      tag
    }
}
`

// Example Variables:
// {
//   "name": "Test Group",
//   "tag": "MMT_2",
//   "description": "Test group",
//   "members": ""
// }
