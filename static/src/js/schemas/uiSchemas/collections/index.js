import acquisitionInformationUiSchema from './acquisitionInformation'
import archiveDistributionInformationUiSchema from './archiveDistributionInformation'
import collectionCitationUiSchema from './collectionCitation'
import collectionInformationUiSchema from './collectionInformation'
import dataCentersUiSchema from './dataCenters'
import dataContactsUiSchema from './dataContacts'
import dataIdentificationUiSchema from './dataIdentification'
import descriptiveKeywordsUiSchema from './descriptiveKeywords'
import metadataInformationUiSchema from './metadataInformation'
import relatedUrlsUiSchema from './relatedUrls'
import spatialInformationUiSchema from './spatialInformation'
import temporalInformationUiSchema from './temporalInformation'

const collectionsUiSchema = {
  'collection-information': collectionInformationUiSchema,
  'data-identification': dataIdentificationUiSchema,
  'related-urls': relatedUrlsUiSchema,
  'descriptive-keywords': descriptiveKeywordsUiSchema,
  'acquisition-information': acquisitionInformationUiSchema,
  'temporal-information': temporalInformationUiSchema,
  'spatial-information': spatialInformationUiSchema,
  'data-centers': dataCentersUiSchema,
  'data-contacts': dataContactsUiSchema,
  'collection-citations': collectionCitationUiSchema,
  'metadata-information': metadataInformationUiSchema,
  'archive-and-distribution-information': archiveDistributionInformationUiSchema
}

export default collectionsUiSchema
