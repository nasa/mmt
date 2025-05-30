import scienceKeywordsUiSchema from './scienceKeywords'
import spatialExtentUiSchema from './spatialExtent'
import specificationUiSchema from './specification'
import temporalExtentsUiSchema from './temporalExtents'
import visualizationInformationUiSchema from './visualizationInformation'

const visualizationUiSchema = {
  'visualization-information': visualizationInformationUiSchema,
  'science-keywords': scienceKeywordsUiSchema,
  'spatial-extent': spatialExtentUiSchema,
  'temporal-extents': temporalExtentsUiSchema,
  specification: specificationUiSchema
}

export default visualizationUiSchema
