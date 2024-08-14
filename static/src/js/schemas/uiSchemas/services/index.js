import descriptiveKeywordsUiSchema from './descriptiveKeywords'
import operationMetadataUiSchema from './operationMetadata'
import relatedUrlsUiSchema from './related_urls'
import serviceConstraintsUiSchema from './serviceConstraints'
import serviceContactsUiSchema from './serviceContacts'
import serviceInformationUiSchema from './serviceInformation'
import organizationUiSchema from './serviceOrganizations'
import serviceQualityUiSchema from './serviceQuality'
import serviceOptionsUiSchema from './serviceOptions'

const serviceUiSchema = {
  'service-information': serviceInformationUiSchema,
  'service-constraints': serviceConstraintsUiSchema,
  'descriptive-keywords': descriptiveKeywordsUiSchema,
  'service-organizations': organizationUiSchema,
  'service-contacts': serviceContactsUiSchema,
  options: serviceOptionsUiSchema,
  'operation-metadata': operationMetadataUiSchema,
  'related-urls': relatedUrlsUiSchema,
  'service-quality': serviceQualityUiSchema
}

export default serviceUiSchema
