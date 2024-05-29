import { gql } from '@apollo/client'

export const GET_PERMISSION_COLLECTIONS = gql`
  query GetPermissionCollection($params: CollectionsInput) {
    collections(params: $params) {
      items {
        conceptId
        directDistributionInformation
        shortName
        provider
        entryTitle
      }
    }
  }
`
