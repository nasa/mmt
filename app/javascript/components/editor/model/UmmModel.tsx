/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeObservable, observable, computed, toJS, action
} from 'mobx'
import { MetadataService } from '../services/MetadataService'
import Draft from './Draft'
import FormModel from './FormModel'

export default class UmmModel implements FormModel {
  fullErrors: FormError[]
  publishErrors: string[]
  formErrors: FormError[]
  draft: Draft
  json: object
  fullSchema: any
  currentSection: FormSection
  visitedFields: string[]
  service: MetadataService
  shouldRedirectAfterPublish: boolean

  constructor(schema: any) {
    this.draft = new Draft()
    this.fullErrors = []
    this.publishErrors = []
    this.formErrors = []
    this.fullSchema = schema
    const first = this.formSections[0]
    this.currentSection = first
    this.visitedFields = []
    this.shouldRedirectAfterPublish = true

    makeObservable(this, {
      draft: observable,
      fullData: computed,
      fullErrors: observable,
      formErrors: observable,
      publishErrors: observable,
      currentSection: observable,
      visitedFields: observable,
      uiSchema: computed,
      addToVisitedFields: action
    })
  }

  get fullData() {
    return this.draft.draft
  }

  set fullData(newValue: object) {
    this.draft.draft = newValue
  }

  getFormData() {
    const formData: { [key: string]: object } = {}
    const config = this.formSections.filter((obj: FormSection) => obj.displayName === this.currentSection.displayName)[0]
    const { properties } = config
    properties.forEach((property: string) => {
      if (this.draft.draft[property]) {
        formData[property] = this.draft.draft[property]
      }
    })

    return formData
  }

  setFormData(value: { [key: string]: object }) {
    const config = this.formSections.filter((obj: FormSection) => obj.displayName === this.currentSection.displayName)[0]
    const { properties } = config
    properties.forEach((property: string) => {
      this.draft.draft[property] = value[property]
    })
    // line below is required otherwise we get some strange json schema errors where it
    // does not recognize string, as it probably has a mobx wrapper?   toJS() basically
    // converts it back to a normal object so type checking (such as string?) works.
    this.draft.draft = JSON.parse(JSON.stringify(toJS(this.draft.draft)))
  }

  getFormSchema(): { [key: string]: object } {
    const config = this.formSections.filter((obj: FormSection) => obj.displayName === this.currentSection.displayName)[0]
    const { properties } = config
    const formSchema: { [key: string]: object } = {}
    formSchema.$id = this.fullSchema.$id
    formSchema.$schema = this.fullSchema.$schema
    formSchema.definitions = this.fullSchema.definitions
    const formSchemaProps: { [key: string]: object } = {}
    properties.forEach((property: string) => {
      formSchemaProps[property] = this.fullSchema.properties[property]
    })
    formSchema.properties = formSchemaProps
    formSchema.$id = this.fullSchema.$id
    formSchema.$schema = this.fullSchema.$schema
    formSchema.definitions = this.fullSchema.definitions
    formSchema.required = this.fullSchema.required
    return formSchema
  }
  addToVisitedFields(id: string) {
    if (!this.visitedFields.includes(id)) { this.visitedFields.push(id) }
  }

  /* istanbul ignore next */
  get uiSchema(): object {
    throw new Error('Method uiSchema() must be implemented.')
  }
  /* istanbul ignore next */
  get formSections(): FormSection[] {
    throw new Error('Method formSections() must be implemented.')
  }
  /* istanbul ignore next */
  get documentType(): string {
    throw new Error('Method documentType() must be implemented.')
  }
  /* istanbul ignore next */
  get documentTypeForDisplay(): string {
    throw new Error('Method documentTypeForDisplay() must be implemented.')
  }
  /* istanbul ignore next */
  migratedSectionName(sectionName: string): string {
    throw new Error(`Method migratedSectionName(${sectionName}) must be implemented.`)
  }
}
