// import { cloneDeep } from 'lodash'
import uuid from 'react-uuid'
import Draft from '../model/Draft'
// import { removeEmpty } from '../utils/json_utils'

export class MetadataService {
  token: string
  docType: string
  userId: string
  providerId: string

  constructor(token: string, docType: string, userId: string, providerId: string) {
    this.token = token
    this.docType = docType
    this.userId = userId
    this.providerId = providerId
  }

  get draftType() {
    return this.docType
  }

  async publishDraft(draft: Draft): Promise<Draft> {
    const url = `/api/${draft.conceptId}/${draft.publishNativeId}/publish`
    const requestOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid()
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    const data = await response.json()
    console.log('error response', data)
    return Promise.reject(data)
  }

  async getDraft(nativeId: string): Promise<Draft> {
    const url = `/api/providers/${this.providerId}/${this.draftType}/${nativeId}`

    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid()
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = this.convertToDraft(data.items)
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async ingestDraft(draft: Draft): Promise<Draft> {
    const url = `/api/providers/${this.providerId}/${this.draftType}/${draft.nativeId}`
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(draft.draft),
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async deleteDraft(draft: Draft): Promise<Draft> {
    const url = `/api/providers/${this.providerId}/${this.draftType}/${draft.nativeId}`
    const requestOptions = {
      method: 'DELETE',
      body: JSON.stringify(draft),
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const draft = new Draft()
      draft.nativeId = null
      draft.draft = {}
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async fetchKmsKeywords(id: string): Promise<object> {
    const url = `/api/kms_keywords/${id}`
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid()
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async fetchCmrKeywords(scheme: string): Promise<object> {
    const url = `/api/cmr_keywords/${scheme}`
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid()
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertToDraft(data: any): Draft {
    const draft = new Draft()
    // draft.draft = data.draft
    draft.draft = data[0].umm
    draft.nativeId = data.id
    draft.apiUserId = data[0].meta['user-id']
    draft.conceptId = data[0].meta['concept-id']
    draft.revisionId = data.revision_id
    draft.associatedCollectionId = data.collection_concept_id
    draft.errors = data.errors
    draft.nativeId = data[0].meta['native-id']
    return draft
  }

  getSchema(): object {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTemplate(id: number): object {
    return null
  }

  private getMmtUrlPath(): string {
    return this.docType
  }
}
