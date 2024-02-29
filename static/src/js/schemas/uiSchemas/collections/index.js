// Import descriptiveKeywordsUiSchema from '../tools/descriptiveKeywords'
import acquisitionInformationUiSchema from './acquisitionInformation'
import collectionInformationUiSchema from './collectionInformation'
import dataIdentificationUiSchema from './dataIdentification'
import relatedUrlsUiSchema from './relatedUrls'
// Import spatialInformationUiSchema from './spatialInformation'
import temporalInformationUiSchema from './temporalInformation'

const collectionsUiSchema = {
  'collection-information': collectionInformationUiSchema,
  'data-identification': dataIdentificationUiSchema,
  'related-urls': relatedUrlsUiSchema,
  // 'descriptive-keywords': descriptiveKeywordsUiSchema,
  'acquisition-information': acquisitionInformationUiSchema,
  'temporal-information': temporalInformationUiSchema
  // 'spatial-information': spatialInformationUiSchema
}

export default collectionsUiSchema
