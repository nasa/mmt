import toolInformationUiSchema from './toolInformation'
import relatedUrlUiSchema from './relatedUrls'
import potentialActionUiSchema from './potentialAction'
import compatabilityAndUsabilityUiSchema from './compatibilityAndUsability'
import descriptiveKeywordsUiSchema from './descriptiveKeywords'
import toolContactsUiSchema from './toolContacts'
import organizationUiSchema from './organization'

const toolsUiSchema = {
  'tool-information': toolInformationUiSchema,
  'related-urls': relatedUrlUiSchema,
  'compatibility-and-usability': compatabilityAndUsabilityUiSchema,
  'descriptive-keywords': descriptiveKeywordsUiSchema,
  'tool-organizations': organizationUiSchema,
  'tool-contacts': toolContactsUiSchema,
  'potential-action': potentialActionUiSchema
}

export default toolsUiSchema
