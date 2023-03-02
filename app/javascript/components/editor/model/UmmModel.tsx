/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeObservable, observable, computed, toJS
} from 'mobx'
import schema from '../data/schemas/umm_tools_schema'
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
  service: MetadataService

  constructor() {
    this.draft = new Draft()
    this.fullErrors = []
    this.publishErrors = []
    this.formErrors = []
    this.fullSchema = schema
    const first = this.formSections[0]
    this.currentSection = first

    makeObservable(this, {
      draft: observable,
      formData: computed,
      fullData: computed,
      fullErrors: observable,
      formErrors: observable,
      publishErrors: observable,
      currentSection: observable,
      uiSchema: computed
    })
  }

  get fullData() {
    return this.draft.json
  }

  set fullData(newValue: object) {
    this.draft.json = newValue
  }

  get formData() {
    const formData: { [key: string]: object } = {}
    const config = this.formSections.filter((obj: FormSection) => obj.displayName === this.currentSection.displayName)[0]
    const { properties } = config
    properties.forEach((property: string) => {
      if (this.draft.json[property]) {
        formData[property] = this.draft.json[property]
      }
    })
    return formData
  }

  set formData(value: { [key: string]: object }) {
    const config = this.formSections.filter((obj: FormSection) => obj.displayName === this.currentSection.displayName)[0]
    const { properties } = config
    properties.forEach((property: string) => {
      this.draft.json[property] = value[property]
    })
    // line below is required otherwise we get some strange json schema errors where it
    // does not recognize string, as it probably has a mobx wrapper?   toJS() basically
    // converts it back to a normal object so type checking (such as string?) works.
    this.draft.json = JSON.parse(JSON.stringify(toJS(this.draft.json)))
  }

  get formSchema(): { [key: string]: object } {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get uiSchema(): object {
    throw new Error('Method uiSchema() must be implemented.')
  }

  get formSections(): FormSection[] {
    throw new Error('Method formSections() must be implemented.')
  }
  get documentType(): string {
    throw new Error('Method documentType() must be implemented.')
  }
  get documentTypeForDisplay():string {
    throw new Error('Method documentTypeForDisplay() must be implemented.')
  }
  migratedSectionName(sectionName: string): string {
    throw new Error(`Method migratedSectionName(${sectionName}) must be implemented.`)
  }
}
