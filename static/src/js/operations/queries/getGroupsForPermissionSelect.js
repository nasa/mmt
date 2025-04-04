import { gql } from '@apollo/client'

export const GET_GROUPS_FOR_PERMISSION_SELECT = gql`
  query GetGroupsForPermissionSelect (
    $params: GroupsInput
  ) {
    groups (
      params: $params
    ) {
      items {
        id
        name
        tag
      }
    }
  }
`
