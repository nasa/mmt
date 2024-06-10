import { gql } from '@apollo/client'

export const GET_COLLECTION_PERMISSION = gql`
  query GetCollectionPermission($conceptId: String!, $collectionParams: CollectionsInput) {
    acl(conceptId: $conceptId) {
      conceptId
      identityType
      location
      name
      providerIdentity
      revisionId
      systemIdentity
      catalogItemIdentity {
        collectionIdentifier
        collectionApplicable
        granuleApplicable
        granuleIdentifier
      }
      collections (params: $collectionParams) {
        count
        items {
          conceptId
          shortName
          title
          version
        }
      }
      groups {
        items {
          permissions
          userType
          id
          name
        }
      }
    }
  }
`
