import uuid from 'react-uuid'
import Draft from '../model/Draft'

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

  async fetchDraft(id: number): Promise<Draft> {
    const url = `/api/${this.getMmtUrlPath()}/${id}`
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
      const draft = new Draft()
      draft.json = data.draft
      draft.apiId = data.id
      draft.apiUserId = data.user_id
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async saveDraft(draft: Draft): Promise<Draft> {
    const url = `/api/${this.getMmtUrlPath()}/`
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(draft.json),
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        Provider: this.providerId,
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = new Draft()
      draft.json = data.draft
      draft.apiId = data.id
      draft.apiUserId = data.user_id
      return draft
    }
    return Promise.reject(new Error(`Error code: ${response.status}`))
  }

  async updateDraft(draft: Draft): Promise<Draft> {
    const url = `/api/${this.getMmtUrlPath()}/${draft.apiId}`
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(draft.json),
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${this.token}`,
        'Client-Id': 'mmt-react-ui',
        'X-Request-Id': uuid(),
        Provider: this.providerId,
        User: this.userId
      }
    }
    const response = await fetch(url, requestOptions)
    if (response.ok) {
      const data = await response.json()
      const draft = new Draft()
      draft.json = data.draft
      draft.apiId = data.id
      draft.apiUserId = data.user_id
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
