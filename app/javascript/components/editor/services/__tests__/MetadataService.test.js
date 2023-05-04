import Draft from '../../model/Draft'
import { MetadataService } from '../MetadataService'

describe('Testing MetadataService', () => {
  async function mockFetch(url) {
    switch (url) {
      case '/api/drafts/1?draft_type=ToolDraft': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            draft: {
              Name: 'a name', LongName: 'a long name', Version: '1', Type: 'Web Portal'
            },
            id: 50,
            user_id: 9
          })
        }
      }
      case '/api/drafts/1?draft_type=VariableDraft': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            draft: {
              Name: 'a name', LongName: 'a long name', Definition: 'Def', StandardName: 'Web Portal'
            },
            id: 50,
            user_id: 9
          })
        }
      }
      case '/api/drafts/55/publish?draft_type=ToolDraft': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            draft: {
              Name: 'a name', LongName: 'a long name', Definition: 'Def', StandardName: 'Web Portal'
            },
            id: 55,
            user_id: 9
          })
        }
      }
      case '/api/drafts/101?draft_type=ToolDraft': {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            error: 'Error found'
          })
        }
      }
      case '/api/drafts/55?draft_type=ToolDraft': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 55
          })
        }
      }
      case '/api/drafts/200?draft_type=ToolDraft': {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            error: 'Error found'
          })
        }
      }
      case '/api/drafts/?draft_type=ToolDraft': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 12
          })
        }
      }
      case '/api/cmr_keywords/science_keywords': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Name: 'a name', LongName: 'a long name', Version: '1', Type: 'Web Portal'
          })
        }
      }
      case '/api/cmr_keywords/science': {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            error: 'Error found'
          })
        }
      }
      case '/api/kms_keywords/science_keywords': {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Name: 'a name', LongName: 'a long name', Version: '1', Type: 'Web Portal'
          })
        }
      }
      case '/api/kms_keywords/science': {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            error: 'Error found'
          })
        }
      }
      default: {
        console.log(`Unhandled request: ${url}`)
        return undefined
      }
    }
  }
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    window.fetch.mockImplementation(mockFetch)
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  beforeAll(() => jest.spyOn(window, 'fetch'))

  test('fetch tool draft', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    metadataService.fetchDraft(1).then((draft) => {
      expect(draft.draft.Name).toEqual('a name')
      expect(draft.draft.LongName).toEqual('a long name')
      expect(draft.apiId).toEqual(50)
    })
    metadataService.fetchDraft(101).then((draft) => {
      console.log(draft)
    }).catch((error) => {
      expect(error.message).toEqual('Error code: 404')
    })
  })

  test('fetch variable draft', async () => {
    const metadataService = new MetadataService('test_token', 'variable_drafts', 'test_user', 'provider')
    metadataService.fetchDraft(1).then((draft) => {
      expect(draft.draft.Name).toEqual('a name')
      expect(draft.draft.LongName).toEqual('a long name')
      expect(draft.draft.Definition).toEqual('Def')
      expect(draft.draft.StandardName).toEqual('Web Portal')
      expect(draft.apiId).toEqual(50)
    })
  })

  test('save draft', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    const draft = new Draft()
    draft.draft = { Name: 'Test Record' }
    metadataService.saveDraft(draft).then((result) => {
      expect(result.apiId).toEqual(12)
    })
  })

  test('update draft', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    const draft = new Draft()
    draft.apiId = 55
    draft.apiUserId = 10
    draft.draft = { Name: 'Test Record' }
    metadataService.updateDraft(draft).then((result) => {
      expect(result.apiId).toEqual(55)
    })
    draft.apiId = 200
    metadataService.updateDraft(draft).then((result) => {
      console.log(result)
    }).catch((error) => {
      expect(error.message).toEqual('Error code: 404')
    })
  })

  test('publish draft', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    const draft = new Draft()
    draft.apiId = 55
    draft.apiUserId = 10
    draft.draft = { Name: 'Test Record' }
    metadataService.publishDraft(draft).then((result) => {
      expect(result.apiId).toEqual(55)
    })
  })

  test('fetch kms keywords', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    metadataService.fetchKmsKeywords('science_keywords').then((keywords) => {
      expect(keywords).toEqual({
        Name: 'a name', LongName: 'a long name', Version: '1', Type: 'Web Portal'
      })
    })
    metadataService.fetchKmsKeywords('science').then((keywords) => {
      console.log(keywords)
    }).catch((error) => {
      expect(error.message).toEqual('Error code: 404')
    })
  })

  test('fetch cmr keywords', async () => {
    const metadataService = new MetadataService('test_token', 'tool_drafts', 'test_user', 'provider')
    metadataService.fetchCmrKeywords('science_keywords').then((keywords) => {
      expect(keywords).toEqual({
        Name: 'a name', LongName: 'a long name', Version: '1', Type: 'Web Portal'
      })
    })
    metadataService.fetchCmrKeywords('science').then((keywords) => {
      console.log(keywords)
    }).catch((error) => {
      expect(error.message).toEqual('Error code: 404')
    })
  })
})
