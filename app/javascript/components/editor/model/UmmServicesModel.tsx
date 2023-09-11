/* eslint-disable @typescript-eslint/no-explicit-any */
import { UiSchema } from '@rjsf/utils'
import UmmModel from './UmmModel'
import schema from '../data/schemas/umm_services_schema'
import servicesConfiguration from '../data/configuration/uiForms/servicesConfiguration'
import CustomArrayFieldTemplate from '../components/templates/CustomArrayFieldTemplate'
import serviceInformationUiSchema from '../data/configuration/uiSchemas/services/service_information'
import serviceConstraintsUiSchema from '../data/configuration/uiSchemas/services/service_constraints'
import descriptiveKeywordsUiSchema from '../data/configuration/uiSchemas/services/descriptive_keywords'
import serviceContactsUISchema from '../data/configuration/uiSchemas/services/service_contacts'
import relatedUrlsUiSchema from '../data/configuration/uiSchemas/services/related_urls'
import serviceOptionsUiSchema from '../data/configuration/uiSchemas/services/service_options'
import serviceQualityUiSchema from '../data/configuration/uiSchemas/services/service_quality'
import serviceOrganizationsUiSchema from '../data/configuration/uiSchemas/services/service_organizations'
import operationMetadataUiSchema from '../data/configuration/uiSchemas/services/operation_metadata'

export default class UmmServicesModel extends UmmModel {
  constructor() {
    super(schema)
  }
  get documentTypeForDisplay() {
    return 'Service Record'
  }
  get documentType() {
    return 'service_drafts'
  }
  get formSections() {
    return servicesConfiguration
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
    if (this.currentSection.displayName === 'Related URLs') {
      const uiSchema: any = relatedUrlsUiSchema
      const urlUiSchema: any = uiSchema.RelatedURLs.items
      urlUiSchema['ui:service'] = this.service

      // Format
      const formatUiSchema: any = uiSchema.RelatedURLs.items.Format
      formatUiSchema['ui:service'] = this.service
      formatUiSchema['ui:keyword_scheme'] = 'granule_data_format'
      formatUiSchema['ui:keyword_scheme_column_names'] = ['short_name']

      // Mime Type
      const mimeTypeUiSchema: any = uiSchema.RelatedURLs.items.MimeType
      mimeTypeUiSchema['ui:service'] = this.service
      mimeTypeUiSchema['ui:keyword_scheme'] = 'mime_type'
      mimeTypeUiSchema['ui:keyword_scheme_column_names'] = ['mime_type']
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Service Information') {
      const uiSchema: any = serviceInformationUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Service Constraints') {
      const uiSchema: any = serviceConstraintsUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Descriptive Keywords') {
      const uiSchema: any = descriptiveKeywordsUiSchema
      const serviceKeywords: any = uiSchema.ServiceKeywords

      serviceKeywords['ui:service'] = this.service
      serviceKeywords['ui:keyword_scheme'] = 'science_keywords'
      serviceKeywords['ui:picker_title'] = 'SERVICE KEYWORD'
      serviceKeywords['ui:scheme_values'] = [
        'ServiceCategory', 'ServiceTopic', 'ServiceTerm', 'ServiceSpecificTerm'
      ]
      serviceKeywords['ui:keyword_scheme_column_names'] = ['servicekeywords', 'category', 'topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3']
      serviceKeywords['ui:filter'] = (path: string[]) => path[1] !== 'EARTH SCIENCE'

      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Service Organizations') {
      const uiSchema: any = serviceOrganizationsUiSchema
      const organizations: any = uiSchema.ServiceOrganizations.items
      organizations['ui:service'] = this.service
      organizations['ui:keyword_scheme'] = 'providers'
      organizations['ui:keyword_scheme_column_names'] = ['short_name', 'long_name']
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Service Contacts') {
      const uiSchema: any = serviceContactsUISchema
      return { ...uiSchema, ...base }
    }

    if (this.currentSection.displayName === 'Options') {
      const uiSchema: any = serviceOptionsUiSchema

      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Operation Metadata') {
      const uiSchema: any = operationMetadataUiSchema
      return { ...uiSchema, ...base }
    }
    if (this.currentSection.displayName === 'Service Quality') {
      const uiSchema: any = serviceQualityUiSchema
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
