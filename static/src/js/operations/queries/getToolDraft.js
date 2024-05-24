import { gql } from '@apollo/client'

// Query to retrieve draft
export const TOOL_DRAFT = gql`
  query ToolDraft($params: DraftInput) {
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
          lastUpdatedDate
          longName
          metadataSpecification
          name
          nativeId
          organizations
          pageTitle: name
          pageTitle: name
          potentialAction
          quality
          relatedUrls
          revisionId
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
