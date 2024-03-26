import { gql } from '@apollo/client'

export const GET_SERVICE = gql`
  query Service($params: ServiceInput, $collectionsParams: CollectionsInput) {
    service(params: $params) {
      accessConstraints
      ancillaryKeywords
      associationDetails
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
      providerId
      revisionDate
      revisionId
      relatedUrls
      serviceKeywords
      serviceOptions
      serviceOrganizations
      supportedInputProjections
      supportedOutputProjections
      supportedReformattings
      serviceQuality
      type
      ummMetadata
      url
      useConstraints
      version
      versionDescription
      collections (params: $collectionsParams) {
        count
        items {
          conceptId
          entryTitle
          shortName
          version
          provider
        }
      }
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "S1200000096-MMT_2",
//   }
// }
