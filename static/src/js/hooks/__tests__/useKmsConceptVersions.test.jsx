import {
  act,
  renderHook,
  waitFor
} from '@testing-library/react'

import getKmsConceptVersions from '@/js/utils/getKmsConceptVersions'

import useKmsConceptVersions from '../useKmsConceptVersions'

vi.mock('@/js/utils/getKmsConceptVersions')

describe('useKmsConceptVersions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when versions are loaded', () => {
    test('should format and sort the versions', async () => {
      getKmsConceptVersions.mockResolvedValue({
        versions: [
          {
            version: '1.0',
            type: 'PAST_PUBLISHED'
          },
          {
            version: '2.0',
            type: 'PUBLISHED'
          },
          {
            version: 'draft',
            type: 'DRAFT'
          }
        ]
      })

      const { result } = renderHook(() => useKmsConceptVersions())

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.versions).toEqual([
        {
          value: 'draft',
          label: 'draft (DRAFT-NEXT RELEASE)',
          type: 'draft'
        },
        {
          value: '2.0',
          label: '2.0 (PRODUCTION)',
          type: 'published'
        },
        {
          value: '1.0',
          label: '1.0 (PAST PUBLISHED)',
          type: 'past_published'
        }
      ])
    })

    test('should reload the available versions when refreshed', async () => {
      getKmsConceptVersions
        .mockResolvedValueOnce({
          versions: [{
            version: 'draft',
            type: 'DRAFT'
          }]
        })
        .mockResolvedValueOnce({
          versions: [{
            version: '2.0',
            type: 'PUBLISHED'
          }]
        })

      const { result } = renderHook(() => useKmsConceptVersions())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      act(() => result.current.refresh())

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.versions).toEqual([{
        value: '2.0',
        label: '2.0 (PRODUCTION)',
        type: 'published'
      }])
    })
  })

  describe('when loading versions fails', () => {
    test('should stop loading and log the error', async () => {
      const error = new Error('Fetch error')
      getKmsConceptVersions.mockRejectedValue(error)

      const { result } = renderHook(() => useKmsConceptVersions())

      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.versions).toEqual([])
      expect(console.error).toHaveBeenCalledWith('Error fetching versions:', error)
    })
  })
})
