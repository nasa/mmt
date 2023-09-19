/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeObservable, observable } from 'mobx'

export default class Draft {
  key: Date
  draft: any
  nativeId: string
  apiUserId: string
  conceptId: string
  revisionId: number
  associatedCollectionId: string
  errors: any
  // nativeId: string
  publishNativeId: string

  constructor() {
    this.key = new Date()
    this.draft = {}
    this.nativeId = ''
    this.apiUserId = ''
    this.conceptId = ''
    this.revisionId = -1
    this.associatedCollectionId = null
    this.errors = {}

    this.publishNativeId = null
    makeObservable(this, {
      draft: observable,
      nativeId: observable,
      apiUserId: observable,
      conceptId: observable,
      revisionId: observable,
      associatedCollectionId: observable,
      errors: observable
    })
  }
}
