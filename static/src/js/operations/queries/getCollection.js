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
      granules {
        count
      }
      isoTopicCategories
      locationKeywords
      nativeId
      metadataAssociations
      metadataDates
      paleoTemporalCoverages
      platforms
      processingLevel
      projects
      providerId: provider
      publicationReferences
      purpose
      quality
      relatedCollections (
        limit: 10
      ) {
        count
        items {
          id
          doi
          title
          relationships {
            relationshipType

            ... on GraphDbRelatedUrl {
              description
              subtype
              type
              url
            }

            ... on GraphDbProject {
              name
            }

            ... on GraphDbPlatformInstrument {
              instrument
              platform
            }
          }
        }
      }
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
      pageTitle: shortName
      spatialExtent
      spatialInformation
      standardProduct
      tags
      tagDefinitions {
        items {
          conceptId
          revisionId
          tagKey
          description
          originatorId
        }
      }
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
      userId
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
