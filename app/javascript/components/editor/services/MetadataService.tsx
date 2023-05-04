import { cloneDeep } from 'lodash'
import uuid from 'react-uuid'
import Draft from '../model/Draft'
import { removeEmpty } from '../utils/json_utils'

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
    if (this.docType === 'tool_drafts') {
      return 'ToolDraft'
    }
    if (this.docType === 'variable_drafts') {
      return 'VariableDraft'
    }
    return this.docType
  }

  async fetchDraft(id: number): Promise<Draft> {
    const url = `/api/drafts/${id}?draft_type=${this.draftType}`
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
      const draft = this.convertToDraft(data)
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async saveDraft(draft: Draft): Promise<Draft> {
    const url = `/api/drafts/?draft_type=${this.draftType}`
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(draft),
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        Provider: this.providerId,
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = this.convertToDraft(data)
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async publishDraft(draft: Draft): Promise<Draft> {
    const url = `/api/drafts/${draft.apiId}/publish?draft_type=${this.draftType}`
    const draftClone = removeEmpty(cloneDeep(draft))
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(draftClone),
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        Provider: this.providerId,
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = this.convertToDraft(data)
      return draft
    }
    const data = await response.json()
    return Promise.reject(data.errors)
  }

  async updateDraft(draft: Draft): Promise<Draft> {
    const url = `/api/drafts/${draft.apiId}?draft_type=${this.draftType}`
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(draft),
      headers: {
        Accept: 'application/json',
        Authorization: `${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        Provider: this.providerId,
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = this.convertToDraft(data)
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
    draft.draft = data.draft
    draft.apiId = data.id
    draft.apiUserId = data.user_id
    draft.conceptId = data.concept_id
    draft.revisionId = data.revision_id
    draft.associatedCollectionId = data.collection_concept_id
    draft.errors = data.errors
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
