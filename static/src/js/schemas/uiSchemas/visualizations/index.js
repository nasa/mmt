import scienceKeywordsUiSchema from './scienceKeywords'
import spatialExtentUiSchema from './spatialExtent'
import temporalExtentsUiSchema from './temporalExtents'
import visualizationInformationUiSchema from './visualizationInformation'

const visualizationUiSchema = {
  'visualization-information': visualizationInformationUiSchema,
  'science-keywords': scienceKeywordsUiSchema,
  'spatial-extent': spatialExtentUiSchema,
  'temporal-extents': temporalExtentsUiSchema
}

export default visualizationUiSchema
