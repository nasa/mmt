import { gql } from '@apollo/client'

export const GET_COLLECTION_PERMISSION = gql`
  query GetCollectionPermission($conceptId: String!) {
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
    collections {
      items {
        conceptId,
        shortName,
        provider,
        directDistributionInformation,
        title,
        version
      }
    }
    conceptId
    name
    }
  }
`
