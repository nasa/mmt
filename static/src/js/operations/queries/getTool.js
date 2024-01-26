import { gql } from '@apollo/client'

export const GET_TOOL = gql`
  query Tool($params: ToolInput){
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
