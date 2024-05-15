import { gql } from '@apollo/client'

// Query to retrieve acls
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
        collectionApplicable
        granuleApplicable
        granuleIdentifier
        name
        providerId
        collectionIdentifier {
          accessValue
          collections (params: $collectionParams) {
            count
            items {
              conceptId
              shortName
              title
              version
            }
          }
          temporal
        }
      }
      groupPermissions {
        groupPermission {
            permissions
            userType
            group {
              name
              id
            }
          }
        }
    }
  }
`
