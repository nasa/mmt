import relatedIdentifiersUiSchema from '@/js/schemas/uiSchemas/citations/relatedIdentifiers'
import citationMetadataUiSchema from '@/js/schemas/uiSchemas/citations/citationMetadata'
import citationInformationUiSchema from './citationInformation'
import citationScienceKeywordsUiSchema from './citationScienceKeywordsUiSchema'

const citationUiSchema = {
  'citation-information': citationInformationUiSchema,
  'science-keywords': citationScienceKeywordsUiSchema,
  'related-identifiers': relatedIdentifiersUiSchema,
  'citation-metadata': citationMetadataUiSchema
}

export default citationUiSchema
