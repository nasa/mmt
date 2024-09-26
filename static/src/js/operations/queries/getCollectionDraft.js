import { gql } from '@apollo/client'

export const COLLECTION_DRAFT = gql`
  query CollectionDraft($params: DraftInput) {
    draft(params: $params) {
      conceptId
      conceptType
      deleted
      nativeId
      name
      providerId
      revisionDate
      revisionId
      ummMetadata
      previewMetadata {
        ... on Collection {
          abstract
          accessConstraints
          additionalAttributes
          associationDetails
          associatedDois
          archiveCenter
          ancillaryKeywords
          archiveAndDistributionInformation
          boxes
          browseFlag
          cloudHosted
          conceptId
          consortiums
          collectionCitations
          collectionDataType
          collectionProgress
          contactGroups
          contactPersons
          coordinateSystem
          dataCenter
          dataCenters
          dataDates
          dataLanguage
          directDistributionInformation
          directoryNames
          doi
          datasetId
          nativeDataFormats
          hasFormats
          hasGranules
          hasSpatialSubsetting
          hasTemporalSubsetting
          hasTransforms
          hasVariables
          isoTopicCategories
          metadataAssociations
          metadataDates
          metadataLanguage
          metadataFormat
          onlineAccessFlag
          organizations
          originalFormat
          lines
          locationKeywords
          paleoTemporalCoverages
          pageTitle: shortName
          platforms
          points
          polygons
          projects
          provider
          publicationReferences
          quality
          nativeId
          processingLevel
          processingLevelId
          purpose
          revisionDate
          revisionId
          relatedUrls
          scienceKeywords
          shortName
          spatialExtent
          spatialInformation
          standardProduct
          summary
          tags
          temporalExtents
          temporalKeywords
          tilingIdentificationSystems
          timeStart
          timeEnd
          title: entryTitle
          useConstraints
          versionDescription
          versionId
          version
        }
      }
    }
  }
`
