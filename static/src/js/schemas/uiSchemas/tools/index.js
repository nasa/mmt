import toolInformationUiSchema from './toolInformation'
import relatedUrlUiSchema from './relatedUrls'
import potentialActionUiSchema from './potentialAction'
// Import compatabilityAndUsabilityUiSchema from './compatibilityAndUsability'
// import descriptiveKeywordsUiSchema from './descriptiveKeywords'
import toolContactsUiSchema from './toolContacts'
import descriptiveKeywordsUiSchema from './descriptiveKeywords'
// Import organizationUiSchema from './organization'

const toolsUiSchema = {
  // 'compatability-and-usability': compatabilityAndUsabilityUiSchema,
  'descriptive-keywords': descriptiveKeywordsUiSchema,
  // 'organization': organizationUiSchema,
  'potential-action': potentialActionUiSchema,
  'related-ur-ls': relatedUrlUiSchema, // Kebab case messing this up
  'tool-contacts': toolContactsUiSchema,
  'tool-information': toolInformationUiSchema

}

export default toolsUiSchema
