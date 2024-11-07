import { gql } from '@apollo/client'

export const GET_SERVICE = gql`
  query GetService($params: ServiceInput, $collectionsParams: CollectionsInput){
    service(params: $params) {
      accessConstraints
      ancillaryKeywords
      associationDetails
      collections (params: $collectionsParams) {
        count
        items {
          conceptId
          provider
          shortName
          title
          version
        }
      }
      conceptId
      contactGroups
      contactPersons
      description
      lastUpdatedDate
      longName
      maxItemsPerOrder
      name
      nativeId
      operationMetadata
      pageTitle: name
      providerId
      relatedUrls
      revisionDate
      revisionId
      revisions {
        count
        items {
          conceptId
          deleted
          revisionDate
          revisionId
          userId
        }
      }
      serviceKeywords
      serviceOptions
      serviceOrganizations
      serviceQuality
      supportedInputProjections
      supportedOutputProjections
      supportedReformattings
      type
      ummMetadata
      url
      useConstraints
      version
      versionDescription
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "S1200000096-MMT_2",
//   }
// }
