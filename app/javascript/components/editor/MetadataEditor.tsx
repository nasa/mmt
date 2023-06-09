import {
  action, computed, makeObservable, observable
} from 'mobx'
import { MetadataService } from './services/MetadataService'
import FormModel from './model/FormModel'
import Draft from './model/Draft'
import FormProperties from './model/FormProperties'
import Status from './model/Status'

export default class MetadataEditor {
  model: FormModel
  service: MetadataService
  formProps: FormProperties
  constructor(model: FormModel, token = 'token', user = 'user', provider = 'MMT_1') {
    this.model = model
    this.service = new MetadataService(token, model.documentType, user, provider)
    this.formProps = new FormProperties()
    makeObservable(this, {
      model: observable,
      navigateTo: action,
      navigateNext: action,
      navigateToDisplayName: action,
      draft: computed,
      fullData: computed,
      formData: computed,
      fullErrors: computed,
      publishErrors: computed,
      formErrors: computed,
      uiSchema: computed
    })
    this.model.service = this.service
  }

  //
  // Accessors
  //

  get loading(): boolean {
    return this.formProps.loading
  }
  set loading(loading: boolean) {
    this.formProps.setLoading(loading)
  }
  get draft() {
    return this.model.draft
  }

  set draft(newValue: Draft) {
    this.model.draft = newValue
  }

  get documentType() {
    return this.model.documentType
  }

  get documentTypeForDisplay() {
    return this.model.documentTypeForDisplay
  }

  // Sections
  get currentSection() {
    return this.model.currentSection
  }

  nextSection(): FormSection {
    const section = this.formSections.filter((obj: FormSection) => obj.displayName.toLowerCase() === this.currentSection.displayName.toLowerCase())[0]
    let index = this.formSections.indexOf(section)
    const { length } = this.formSections
    if (index === length - 1) {
      index = -1
    }
    const nextSection = this.formSections[index + 1]
    return nextSection
  }

  migratedSectionName(sectionName: string) {
    return this.model.migratedSectionName(sectionName)
  }

  // Full schema/data
  get fullSchema() {
    return this.model.fullSchema
  }

  get fullData() {
    return this.model.fullData
  }

  get fullErrors() {
    return this.model.fullErrors
  }

  set fullErrors(errors) {
    this.model.fullErrors = errors
  }

  set publishErrors(errors) {
    this.model.publishErrors = errors
  }

  get publishErrors() {
    return this.model.publishErrors
  }

  set status(status: Status) {
    this.formProps.setStatus(status)
  }
  get status() {
    return this.formProps.status
  }

  // Form schema/data
  get formSchema() {
    return this.model.getFormSchema()
  }

  get formData() {
    return this.model.getFormData()
  }

  set formData(value) {
    this.model.setFormData(value)
  }

  get formErrors() {
    return this.model.formErrors
  }

  set formErrors(errors) {
    this.model.formErrors = errors
  }

  get formSections() {
    return this.model.formSections
  }

  // uiSchema
  get uiSchema() {
    return this.model.uiSchema
  }
  get focusField() {
    return this.formProps.focusField ?? ''
  }
  get arrayFieldAutoScroll() {
    return this.formProps.arrayFieldAutoScroll
  }

  hasVisitedFields(id: string) {
    const fields = this.model.visitedFields
    return fields.includes(id)
  }

  // Intents
  navigateTo(section: FormSection) {
    this.model.currentSection = section
  }
  navigateToDisplayName(displayName: string) {
    let name = displayName
    if (!displayName) {
      name = ''
    }
    const section = this.formSections.filter((obj: FormSection) => obj.displayName.toLowerCase() === name.toLowerCase())[0]
    this.navigateTo(section)
  }
  setFocusField(name: string) {
    if (name !== undefined) {
      this.formProps.setFocusField(name)
    }
  }
  setArrayAutoScroll(index: number) {
    this.formProps.setArrayAutoScroll(index)
  }
  navigateNext() {
    const section = this.formSections.filter((obj: FormSection) => obj.displayName.toLowerCase() === this.currentSection.displayName.toLowerCase())[0]
    let index = this.formSections.indexOf(section)
    const { length } = this.formSections
    if (index === length - 1) {
      index = -1
    }
    const nextSection = this.formSections[index + 1]
    this.navigateToDisplayName(nextSection.displayName)
  }
  addToVisitedFields(sectionName: string) {
    this.model.addToVisitedFields(sectionName)
  }
  // Service

  async fetchDraft(draftId: number): Promise<Draft> {
    return this.service.fetchDraft(draftId)
  }

  async saveDraft(draft: Draft): Promise<Draft> {
    if (this.model.draft.apiId === -1) {
      return this.service.saveDraft(draft)
    }
    return this.service.updateDraft(draft)
  }

  async publishDraft(draft: Draft): Promise<Draft> {
    return this.service.publishDraft(draft)
  }

  async deleteDraft(draft: Draft): Promise<Draft> {
    return this.service.deleteDraft(draft)
  }

  async fetchKmsKeywords(keywordScheme: string): Promise<object> {
    return this.service.fetchKmsKeywords(keywordScheme)
  }
}
