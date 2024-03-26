import { gql } from '@apollo/client'

export const GET_TOOL = gql`
  query Tool($params: ToolInput, $collectionsParams: CollectionsInput){
    tool(params: $params) {
      accessConstraints
      ancillaryKeywords
      associationDetails
      conceptId
      contactGroups
      contactPersons
      description
      doi
      nativeId
      lastUpdatedDate
      longName
      metadataSpecification
      name
      organizations
      providerId
      potentialAction
      quality
      revisionId
      revisionDate
      relatedUrls
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
      collections (params: $collectionsParams) {
        count
        items {
          title
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
//     "conceptId": "T1200000096-MMT_2",
//   }
// }
