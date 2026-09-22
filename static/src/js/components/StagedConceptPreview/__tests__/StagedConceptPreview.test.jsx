import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import Providers from '@/js/providers/Providers/Providers'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import deleteStagedConcept from '@/js/utils/deleteStagedConcept'
import errorLogger from '@/js/utils/errorLogger'
import getStagedConcept from '@/js/utils/getStagedConcept'
import getUmmVersion from '@/js/utils/getUmmVersion'

import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'

import StagedConceptPreview from '../StagedConceptPreview'

vi.mock('@/js/utils/getStagedConcept')
vi.mock('@/js/utils/deleteStagedConcept')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/getUmmVersion')
vi.mock('@/js/hooks/useAvailableProviders')

const mockUmmVersion = 'mock-umm-c-version'

getUmmVersion.mockReturnValue(mockUmmVersion)

const mockMetadata = {
  EntryTitle: 'Mock Staged Collection',
  ShortName: 'Mock Short Name',
  Version: '1'
}

const setup = ({ mocks = [] } = {}) => {
  useAvailableProviders.mockReturnValue({ providerIds: ['MMT_2'] })

  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/collections/staged/mock-record-id']}>
          <Routes>
            <Route
              element={<StagedConceptPreview />}
              path="/collections/staged/:id"
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return { user }
}

describe('StagedConceptPreview', () => {
  describe('when the staged concept is retrieved successfully', () => {
    test('renders the metadata preview', async () => {
      getStagedConcept.mockResolvedValue({ concept: mockMetadata })

      setup()

      // Short name + the "Staged" badge are the page title
      expect(await screen.findByText('Mock Short Name')).toBeInTheDocument()
      expect(screen.getByText('Staged')).toBeInTheDocument()

      // Long name (EntryTitle) is shown by CollectionPreview in the body
      expect(screen.getByText('Mock Staged Collection')).toBeInTheDocument()

      expect(getStagedConcept).toHaveBeenCalledTimes(1)
      const [, conceptType, recordId] = getStagedConcept.mock.calls[0]
      expect(conceptType).toBe('collections')
      expect(recordId).toBe('mock-record-id')
    })
  })

  describe('while the staged concept is still loading', () => {
    test('disables the Save as New Draft and Delete actions', async () => {
      let resolveGetStagedConcept
      getStagedConcept.mockReturnValue(new Promise((resolve) => {
        resolveGetStagedConcept = resolve
      }))

      setup()

      const saveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
      const deleteButton = screen.getByRole('button', { name: /Delete/ })

      expect(saveButton).toBeDisabled()
      expect(deleteButton).toBeDisabled()

      resolveGetStagedConcept({ concept: mockMetadata })

      await waitFor(() => {
        expect(saveButton).toBeEnabled()
      })

      expect(deleteButton).toBeEnabled()
    })
  })

  describe('when retrieving the staged concept results in an error', () => {
    test('renders an error banner', async () => {
      getStagedConcept.mockRejectedValue(new Error('Staged metadata not found.'))

      setup()

      expect(await screen.findByText('Staged metadata not found.')).toBeInTheDocument()
      expect(errorLogger).toHaveBeenCalledWith(new Error('Staged metadata not found.'), 'StagedConceptPreview: getStagedConcept')
    })
  })

  describe('when the response resolves without a concept', () => {
    test('renders an error banner instead of crashing', async () => {
      getStagedConcept.mockResolvedValue({ concept: null })

      setup()

      expect(await screen.findByText('Staged metadata not found. It may have expired or already been saved as new draft.')).toBeInTheDocument()
      expect(errorLogger).toHaveBeenCalledWith(
        new Error('Staged metadata not found. It may have expired or already been saved as new draft.'),
        'StagedConceptPreview: getStagedConcept'
      )
    })
  })

  describe('Delete', () => {
    beforeEach(() => {
      getStagedConcept.mockResolvedValue({ concept: mockMetadata })
    })

    describe('when clicking Delete and confirming', () => {
      test('deletes the staged concept and navigates to the collections list', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        deleteStagedConcept.mockResolvedValue()

        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        expect(screen.getByText(/Are you sure you want to delete this staged record/)).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(deleteStagedConcept).toHaveBeenCalledTimes(1)
        })

        const [, conceptType, recordId] = deleteStagedConcept.mock.calls[0]
        expect(conceptType).toBe('collections')
        expect(recordId).toBe('mock-record-id')

        expect(navigateSpy).toHaveBeenCalledWith('/collections')
      })
    })

    describe('when clicking No', () => {
      test('does not delete the staged concept', async () => {
        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(deleteStagedConcept).toHaveBeenCalledTimes(0)
      })
    })

    describe('when deleting results in an error', () => {
      test('calls addNotification and errorLogger', async () => {
        deleteStagedConcept.mockRejectedValue(new Error('An error occurred'))

        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'StagedConceptPreview: deleteStagedConcept')
        })
      })
    })
  })

  describe('Save as New Draft', () => {
    beforeEach(() => {
      getStagedConcept.mockResolvedValue({ concept: mockMetadata })
      deleteStagedConcept.mockResolvedValue()
    })

    describe('when choosing a provider and submitting results in a success', () => {
      test('ingests a collection draft and navigates to the new draft', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: mockMetadata,
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: mockUmmVersion
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'C1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        const saveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
        await user.click(saveButton)

        const providerSelect = screen.getByLabelText('Select a provider')
        await user.selectOptions(providerSelect, 'MMT_2')

        const submitButton = screen.getByRole('button', { name: 'Save & Create Draft' })
        await user.click(submitButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })

        await waitFor(() => {
          expect(deleteStagedConcept).toHaveBeenCalledTimes(1)
        })

        const [, conceptType, recordId] = deleteStagedConcept.mock.calls[0]
        expect(conceptType).toBe('collections')
        expect(recordId).toBe('mock-record-id')
      })
    })

    describe('when the staged record fails to delete after the draft is created', () => {
      test('still navigates to the new draft and logs the error', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        deleteStagedConcept.mockRejectedValue(new Error('Failed to delete staged metadata'))

        const { user } = setup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: mockMetadata,
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: mockUmmVersion
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'C1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        const saveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
        await user.click(saveButton)

        const providerSelect = screen.getByLabelText('Select a provider')
        await user.selectOptions(providerSelect, 'MMT_2')

        const submitButton = screen.getByRole('button', { name: 'Save & Create Draft' })
        await user.click(submitButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('Failed to delete staged metadata'), 'StagedConceptPreview: deleteStagedConcept')
        })
      })
    })

    describe('when the ingest mutation results in an error', () => {
      test('calls errorLogger', async () => {
        const { user } = setup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: mockMetadata,
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: mockUmmVersion
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const saveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
        await user.click(saveButton)

        const providerSelect = screen.getByLabelText('Select a provider')
        await user.selectOptions(providerSelect, 'MMT_2')

        const submitButton = screen.getByRole('button', { name: 'Save & Create Draft' })
        await user.click(submitButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'StagedConceptPreview: ingestDraftMutation')
        })
      })
    })

    describe('when retrying after the ingest mutation results in an error', () => {
      test('ingests a collection draft and navigates to the new draft', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const request = {
          query: INGEST_DRAFT,
          variables: {
            conceptType: 'Collection',
            metadata: mockMetadata,
            nativeId: 'MMT_mock-uuid',
            providerId: 'MMT_2',
            ummVersion: mockUmmVersion
          }
        }

        const { user } = setup({
          mocks: [
            {
              request,
              error: new Error('An error occurred')
            },
            {
              request,
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'C1000000-MMT',
                    revisionId: '1'
                  }
                }
              }
            }
          ]
        })

        const saveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
        await user.click(saveButton)

        const providerSelect = screen.getByLabelText('Select a provider')
        await user.selectOptions(providerSelect, 'MMT_2')

        const submitButton = screen.getByRole('button', { name: 'Save & Create Draft' })
        await user.click(submitButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'StagedConceptPreview: ingestDraftMutation')
        })

        const retrySaveButton = await screen.findByRole('button', { name: /Save as New Draft/ })
        await user.click(retrySaveButton)

        const retryProviderSelect = screen.getByLabelText('Select a provider')
        await user.selectOptions(retryProviderSelect, 'MMT_2')

        const retrySubmitButton = screen.getByRole('button', { name: 'Save & Create Draft' })
        await user.click(retrySubmitButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })

        // The stale error from the first attempt should not be logged again
        // alongside the successful retry
        expect(errorLogger).toHaveBeenCalledTimes(1)
      })
    })
  })
})
