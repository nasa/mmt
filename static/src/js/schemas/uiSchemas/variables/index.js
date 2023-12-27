import dimensionsUiSchema from './dimensions'
import fillValuesUiSchema from './fillValue'
import measurementIdentifiersUiSchema from './measurementIdentifiers'
import SamplingIdentifiersUiSchema from './samplingIdentifiers'
import scienceKeywordsUiSchema from './scienceKeywords'
import variableInformationUiSchema from './variableInformation'

const variableUiSchema = {
  'variable-information': variableInformationUiSchema,
  'fill-values': fillValuesUiSchema,
  dimensions: dimensionsUiSchema,
  'measurement-identifiers': measurementIdentifiersUiSchema,
  'sampling-identifiers': SamplingIdentifiersUiSchema,
  'science-keywords': scienceKeywordsUiSchema
}

export default variableUiSchema
