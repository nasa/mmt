/* eslint-disable @typescript-eslint/no-explicit-any */
import toolInformationUiSchema from '../data/configuration/uiSchemas/tools/tool_information'
import relatedUrlsUiSchema from '../data/configuration/uiSchemas/tools/related_urls'
import toolsConfiguration from '../data/configuration/uiForms/toolsConfiguration'
import organizationUiSchema from '../data/configuration/uiSchemas/tools/organization'
import UmmModel from './UmmModel'
import descriptiveKeywordsUiSchema from '../data/configuration/uiSchemas/tools/descriptive_keywords'
import potentialActionUiSchema from '../data/configuration/uiSchemas/tools/potential_action'

export default class UmmToolsModel extends UmmModel {
  get documentTypeForDisplay() {
    return 'Tool Record'
  }
  get documentType() {
    return 'tool_drafts'
  }
  get formSections() {
    return toolsConfiguration
  }

  get uiSchema() {
    const base = { 'ui:submitButtonOptions': { norender: true, submitText: 'Save' } }

    if (this.currentSection.displayName === 'Tool Information') {
      const uiSchema: any = toolInformationUiSchema
      const urlUiSchema: any = uiSchema.URL
      urlUiSchema['ui:service'] = this.service
      urlUiSchema['ui:keyword_scheme'] = 'rucontenttype'
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Descriptive Keywords') {
      const uiSchema = descriptiveKeywordsUiSchema
      const toolKeywords: any = uiSchema.ToolKeywords
      toolKeywords['ui:service'] = this.service
      toolKeywords['ui:keyword_scheme'] = 'science_keywords'
      return uiSchema
    }
    if (this.currentSection.displayName === 'Tool Organizations') {
      const uiSchema: any = organizationUiSchema
      const organizations: any = uiSchema.Organizations.items
      organizations['ui:service'] = this.service
      organizations['ui:keyword_scheme'] = 'providers'
      organizations['ui:keyword_scheme_column_names'] = ['short_name', 'long_name', 'url']
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Potential Action') {
      const uiSchema: any = potentialActionUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Related URLs') {
      const uiSchema: any = relatedUrlsUiSchema
      const urlUiSchema: any = uiSchema.RelatedURLs.items
      urlUiSchema['ui:service'] = this.service
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
