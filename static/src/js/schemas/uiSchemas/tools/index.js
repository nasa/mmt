import toolInformationUiSchema from './toolInformation'
import relatedUrlUiSchema from './relatedUrls'
import potentialActionUiSchema from './potentialAction'
import compatabilityAndUsabilityUiSchema from './compatibilityAndUsability'
import descriptiveKeywordsUiSchema from './descriptiveKeywords'
import toolContactsUiSchema from './toolContacts'
import organizationUiSchema from './organization'

const toolsUiSchema = {
  'tool-information': toolInformationUiSchema,
  'related-ur-ls': relatedUrlUiSchema, // Kebab case messing this up
  'compatibility-and-usability': compatabilityAndUsabilityUiSchema,
  'descriptive-keywords': descriptiveKeywordsUiSchema,
  'tool-organizations': organizationUiSchema,
  'tool-contacts': toolContactsUiSchema,
  'potential-action': potentialActionUiSchema
}

export default toolsUiSchema
