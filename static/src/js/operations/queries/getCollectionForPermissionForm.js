import { gql } from '@apollo/client'

export const GET_COLLECTION_FOR_PERMISSION_FORM = gql`
  query GetCollectionForPermissionForm($conceptId: String!, $params: CollectionsInput) {
    acl(conceptId: $conceptId) {
      catalogItemIdentity {
      providerId
      collectionApplicable
      collectionIdentifier
      granuleApplicable
      granuleIdentifier
    }
    groups {
      items {
        id
        name
        permissions
        tag
        userType
      }
    }
    collections(params: $params) {
      count
      items {
        conceptId,
        shortName,
        provider,
        directDistributionInformation,
        entryTitle,
        version
      }
    }
    conceptId
    name
    }
  }
`
