import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import { getApplicationConfig } from 'sharedUtils/getConfig'
import getKmsKeywordTree from '../getKmsKeywordTree'

vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

global.fetch = vi.fn()

describe('getKmsKeywordTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getApplicationConfig.mockReturnValue({ kmsHost: 'http://example.com' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when fetching and processing keyword tree', () => {
    test('should correctly fetch and process keyword tree', async () => {
      const mockResponse = {
        tree: {
          scheme: 'idnnode',
          version: '21.0',
          timestamp: '2025-04-24 20:42:34',
          treeData: [
            {
              key: 'keywords-uuid',
              title: 'Keywords',
              children: [
                {
                  key: '118d366b-c4c7-432c-bd96-4cee2263a541',
                  title: 'IDN Nodes',
                  children: [
                    {
                      key: '913d42e2-1641-4f5e-8273-379ddd3812d5',
                      title: 'ACADIS',
                      children: []
                    },
                    {
                      key: '13381733-968f-4fd6-b70c-aac6a77b2657',
                      title: 'ACE/CRC',
                      children: []
                    },
                    {
                      key: '47308f11-79b0-46c2-b0c9-06d0b15ae845',
                      title: 'AMD',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await getKmsKeywordTree({
        version: '21.0',
        version_type: 'published'
      }, { name: 'idnnode' })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/tree/concept_scheme/idnnode?version=published',
        { method: 'GET' }
      )

      expect(result).toEqual({
        id: '118d366b-c4c7-432c-bd96-4cee2263a541',
        key: '118d366b-c4c7-432c-bd96-4cee2263a541',
        title: 'IDN Nodes',
        children: [
          {
            id: '913d42e2-1641-4f5e-8273-379ddd3812d5',
            key: '913d42e2-1641-4f5e-8273-379ddd3812d5',
            title: 'ACADIS',
            children: []
          },
          {
            id: '13381733-968f-4fd6-b70c-aac6a77b2657',
            key: '13381733-968f-4fd6-b70c-aac6a77b2657',
            title: 'ACE/CRC',
            children: []
          },
          {
            id: '47308f11-79b0-46c2-b0c9-06d0b15ae845',
            key: '47308f11-79b0-46c2-b0c9-06d0b15ae845',
            title: 'AMD',
            children: []
          }
        ]
      })
    })

    test('should use "published" as version for published version type', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ tree: { treeData: [{ children: [{}] }] } })
      })

      await getKmsKeywordTree({
        version: '21.0',
        version_type: 'published'
      }, { name: 'idnnode' })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/tree/concept_scheme/idnnode?version=published',
        { method: 'GET' }
      )
    })
  })

  describe('when encountering errors', () => {
    test('should throw an error when fetch fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })).rejects.toThrow(
        'getKmsKeywordTree HTTP error! status: 404'
      )
    })

    test('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })).rejects.toThrow('Network error')
    })

    test('should handle JSON parsing errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })

      await expect(getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })).rejects.toThrow('Invalid JSON')
    })
  })

  describe('when edge cases', () => {
    test('should handle empty tree', async () => {
      const mockResponse = {
        tree: {
          treeData: [{ children: [{}] }]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })

      expect(result).toEqual({})
    })

    test('should handle tree with no children', async () => {
      const mockResponse = {
        tree: {
          treeData: [
            {
              children: [
                {
                  key: 'root-key',
                  title: 'Root'
                }
              ]
            }
          ]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })

      expect(result).toEqual({
        id: 'root-key',
        key: 'root-key',
        title: 'Root'
      })
    })

    test('should handle nodes with no key', async () => {
      const mockResponse = {
        tree: {
          treeData: [
            {
              children: [
                {
                  title: 'Root',
                  children: [
                    { title: 'Child' }
                  ]
                }
              ]
            }
          ]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })

      expect(result).toEqual({
        id: 'Root',
        title: 'Root',
        children: [
          {
            id: 'Child',
            title: 'Child'
          }
        ]
      })
    })
  })

  describe('when handling version', () => {
    test('should use version number for non-published versions', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ tree: { treeData: [{ children: [{}] }] } })
      })

      await getKmsKeywordTree({
        version: '21.0',
        version_type: 'draft'
      }, { name: 'idnnode' })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/tree/concept_scheme/idnnode?version=21.0',
        { method: 'GET' }
      )
    })
  })

  describe('when handling scheme', () => {
    test('should use the correct scheme name in the URL', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ tree: { treeData: [{ children: [{}] }] } })
      })

      await getKmsKeywordTree({ version: '21.0' }, { name: 'Earth Science' })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/tree/concept_scheme/Earth%20Science?version=21.0',
        { method: 'GET' }
      )
    })
  })

  describe('when handling response structure', () => {
    test('should handle deeply nested tree structures', async () => {
      const mockResponse = {
        tree: {
          treeData: [
            {
              children: [
                {
                  key: 'root',
                  title: 'Root',
                  children: [
                    {
                      key: 'child1',
                      title: 'Child 1',
                      children: [
                        {
                          key: 'grandchild1',
                          title: 'Grandchild 1',
                          children: []
                        }
                      ]
                    },
                    {
                      key: 'child2',
                      title: 'Child 2',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await getKmsKeywordTree({ version: '21.0' }, { name: 'idnnode' })

      expect(result).toEqual({
        id: 'root',
        key: 'root',
        title: 'Root',
        children: [
          {
            id: 'child1',
            key: 'child1',
            title: 'Child 1',
            children: [
              {
                id: 'grandchild1',
                key: 'grandchild1',
                title: 'Grandchild 1',
                children: []
              }
            ]
          },
          {
            id: 'child2',
            key: 'child2',
            title: 'Child 2',
            children: []
          }
        ]
      })
    })
  })

  describe('when providing a search pattern', () => {
    test('should append search pattern to the endpoint URL', async () => {
      const mockResponse = {
        tree: {
          treeData: [{ children: [{}] }]
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const searchPattern = 'someSearchPattern'
      await getKmsKeywordTree(
        {
          version: '21.0',
          version_type: 'draft'
        },
        { name: 'idnnode' },
        searchPattern
      )

      expect(global.fetch).toHaveBeenCalledWith(
        'http://example.com/tree/concept_scheme/idnnode?version=21.0&filter=someSearchPattern',
        { method: 'GET' }
      )
    })
  })
})
