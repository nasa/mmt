/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UiSchema } from '@rjsf/utils'
import UmmModel from './UmmModel'
import CustomArrayFieldTemplate from '../components/CustomArrayFieldTemplate'
import varConfiguration from '../data/configuration/uiForms/varConfiguration'
import schema from '../data/schemas/umm_var_schema'
import scienceKeywordsUiSchema from '../data/configuration/uiSchemas/variables/science_keywords'
import variableInformationUiSchema from '../data/configuration/uiSchemas/variables/variable_information'
import dimensionsUiSchema from '../data/configuration/uiSchemas/variables/dimensions'
import fillValuesUiSchema from '../data/configuration/uiSchemas/variables/fill_values'
import SamplingIdentifiersUiSchema from '../data/configuration/uiSchemas/variables/sampling_identifiers'
import measurementIdentifiersUiSchema from '../data/configuration/uiSchemas/variables/measurement_identifiers'
import SetsUiSchema from '../data/configuration/uiSchemas/variables/sets'

export default class UmmVarModel extends UmmModel {
  constructor() {
    super(schema)
  }
  get documentTypeForDisplay() {
    return 'Variable Record'
  }
  get documentType() {
    return 'variable_drafts'
  }
  get formSections() {
    return varConfiguration
  }
  getFormSchema(): { [key: string]: object } {
    // use this function to edit schema
    return super.getFormSchema()
  }
  get uiSchema() {
    const base: UiSchema = {
      'ui:submitButtonOptions': { norender: true, submitText: 'Save' },
      'ui:ArrayFieldTemplate': CustomArrayFieldTemplate
    }
    if (this.currentSection.displayName === 'Science Keywords') {
      const uiSchema = scienceKeywordsUiSchema
      const scienceKeywords: any = uiSchema.ScienceKeywords
      scienceKeywords['ui:service'] = this.service

      scienceKeywords['ui:keyword_scheme'] = 'science_keywords'
      scienceKeywords['ui:picker_title'] = 'SCIENCE KEYWORDS'
      scienceKeywords['ui:scheme_values'] = [
        'Category', 'Topic', 'Term', 'VariableLevel1', 'VariableLevel2', 'VariableLevel3'
      ]
      scienceKeywords['ui:keyword_scheme_column_names'] = ['sciencekeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3']
      scienceKeywords['ui:filter'] = (path: string[]) => path[1] !== 'EARTH SCIENCE SERVICES'
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Variable Information') {
      const uiSchema: any = variableInformationUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Dimensions') {
      const uiSchema: any = dimensionsUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Fill Values') {
      const uiSchema: any = fillValuesUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Measurement Identifiers') {
      const uiSchema: any = measurementIdentifiersUiSchema
      uiSchema.MeasurementIdentifiers.items['ui:service'] = this.service
      uiSchema.MeasurementIdentifiers.items.MeasurementQuantities.items['ui:service'] = this.service

      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Sampling Identifiers') {
      const uiSchema: any = SamplingIdentifiersUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Sets') {
      const uiSchema: any = SetsUiSchema
      return { ...uiSchema, ...base }
    }
    return { ...base }
  }

  // In this case the old preview sends the same section name that the react component uses (just lowercase), so
  // nothing needs to be migrated. once the old MMT preview is replaced, this 'migrate" functionality can be removed.
  migratedSectionName(sectionName: string): string {
    return sectionName
  }
}
