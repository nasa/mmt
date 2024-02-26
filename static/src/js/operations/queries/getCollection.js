import { gql } from '@apollo/client'

export const GET_COLLECTION = gql`
  query GetCollection ($params: CollectionInput) {
    collection (params: $params) {
      abstract
      accessConstraints
      additionalAttributes
      ancillaryKeywords
      archiveAndDistributionInformation
      associatedDois
      collectionCitations
      collectionProgress
      conceptId
      contactGroups
      contactPersons
      dataCenters
      dataDates
      directDistributionInformation
      doi
      isoTopicCategories
      locationKeywords
      metadataAssociations
      metadataDates
      paleoTemporalCoverages
      platforms
      processingLevel
      projects
      publicationReferences
      purpose
      quality

      relatedUrls
      scienceKeywords
      services {
        count
        items {
          conceptId
          description
          name
          type
          longName
          url
        }
      }
      shortName
      spatialExtent
      spatialInformation
      standardProduct
      tags
      temporalExtents
      temporalKeywords
      tilingIdentificationSystems
      title
      tools {
        count
        items {
          conceptId
          name
          description
          type
          url
        }
      }
      ummMetadata
      useConstraints
      variables {
        count
        items {
          conceptId
          name
        }
      }
      versionDescription
      versionId
    }
  }
`
