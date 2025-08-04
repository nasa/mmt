import citationMetadataUiSchema from '@/js/schemas/uiSchemas/citations/citationMetadata'
import relatedIdentifiersUiSchema from '@/js/schemas/uiSchemas/citations/relatedIdentifiers'
import citationInformationUiSchema from './citationInformation'
import citationScienceKeywordsUiSchema from './citationScienceKeywordsUiSchema'

const citationUiSchema = {
  'citation-information': citationInformationUiSchema,
  'citation-metadata': citationMetadataUiSchema,
  'related-identifiers': relatedIdentifiersUiSchema,
  'science-keywords': citationScienceKeywordsUiSchema
}

export default citationUiSchema
