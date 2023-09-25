/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, makeObservable, observable } from 'mobx'

export default class Draft {
  key: Date
  draft: any
  nativeId: string
  apiUserId: string
  conceptId: string
  revisionId: number
  associatedCollectionId: string
  errors: any

  get publishNativeId(): string {
    return this.nativeId.split('-').at(0)
  }

  constructor() {
    this.key = new Date()
    this.draft = {}
    this.nativeId = ''
    this.apiUserId = ''
    this.conceptId = ''
    this.revisionId = -1
    this.associatedCollectionId = null
    this.errors = {}

    makeObservable(this, {
      draft: observable,
      nativeId: observable,
      publishNativeId: computed,
      apiUserId: observable,
      conceptId: observable,
      revisionId: observable,
      associatedCollectionId: observable,
      errors: observable
    })
  }
}
