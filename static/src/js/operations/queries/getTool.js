import { gql } from '@apollo/client'

export const GET_TOOL = gql`
  query Tool ($params: ToolInput, $collectionsParams: CollectionsInput){
    tool (params: $params) {
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
      doi
      lastUpdatedDate
      longName
      metadataSpecification
      nativeId
      organizations
      name
      pageTitle: name
      potentialAction
      providerId
      quality
      relatedUrls
      revisionDate
      revisionId
      revisions {
        count
        items {
          conceptId
          revisionDate
          revisionId
          userId
        }
      }
      searchAction
      supportedBrowsers
      supportedInputFormats
      supportedOperatingSystems
      supportedOutputFormats
      supportedSoftwareLanguages
      toolKeywords
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
//     "conceptId": "T1200000096-MMT_2",
//   }
// }
