import dimensionsUiSchema from './dimensions'
import fillValuesUiSchema from './fillValue'
import measurementIdentifiersUiSchema from './measurementIdentifiers'
import SamplingIdentifiersUiSchema from './samplingIdentifiers'
import scienceKeywordsUiSchema from './scienceKeywords'
import variableInformationUiSchema from './variableInformation'
import relatedUrlsUiSchema from './relatedUrls'
import SetsUiSchema from './sets'
import instanceInformationUiSchema from './instanceInformation'

const variableUiSchema = {
  'variable-information': variableInformationUiSchema,
  'fill-values': fillValuesUiSchema,
  dimensions: dimensionsUiSchema,
  'measurement-identifiers': measurementIdentifiersUiSchema,
  'sampling-identifiers': SamplingIdentifiersUiSchema,
  'science-keywords': scienceKeywordsUiSchema,
  sets: SetsUiSchema,
  'related-urls': relatedUrlsUiSchema,
  'instance-information': instanceInformationUiSchema
}

export default variableUiSchema
