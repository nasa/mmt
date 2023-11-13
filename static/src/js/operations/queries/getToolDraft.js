import { gql } from '@apollo/client'

// Query to retrieve tool draft
export const GET_TOOL_DRAFT = gql`
  query Draft($params: DraftInput) {
    draft(params: $params) {
      conceptId
      conceptType
      deleted
      name
      nativeId
      providerId
      revisionDate
      revisionId
      ummMetadata
      previewMetadata {
        ... on Tool {
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
          potentialAction
          quality
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
    }
  }
`

// Example Variables:
// {
//   "params": {
//     "conceptId": "TD1200000096-MMT_2",
//     "conceptType": "Tool"
//   }
// }
