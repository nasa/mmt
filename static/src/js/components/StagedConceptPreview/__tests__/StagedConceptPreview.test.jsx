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
import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import { GET_COLLECTION } from '@/js/operations/queries/getCollection'

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
              path="/:type/staged/:id"
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

  describe('Save as Draft to Existing Collection', () => {
    beforeEach(() => {
      getStagedConcept.mockResolvedValue({ concept: mockMetadata })
      deleteStagedConcept.mockResolvedValue()
    })

    describe('when exactly one matching collection is found', () => {
      test('shows a diff and ingests a draft under the existing nativeId/providerId on confirm', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Existing Published Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Existing Published Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: {
                    nativeId: 'existing-native-id',
                    providerId: 'MMT_2',
                    ummMetadata: {
                      EntryTitle: 'Existing Published Collection',
                      ShortName: 'Mock Short Name',
                      Version: '1'
                    }
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Collection',
                  metadata: mockMetadata,
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummVersion: mockUmmVersion
                }
              },
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'C1000000-MMT',
                    revisionId: '2'
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        const confirmButton = await screen.findByRole('button', { name: 'Save as Draft' })
        await user.click(confirmButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })

        await waitFor(() => {
          expect(deleteStagedConcept).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('when the existing published collection matches the staged metadata exactly', () => {
      test('shows a no differences message instead of the diff viewer and still allows confirming', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Mock Staged Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Mock Staged Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: {
                    nativeId: 'existing-native-id',
                    providerId: 'MMT_2',
                    ummMetadata: mockMetadata
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Collection',
                  metadata: mockMetadata,
                  nativeId: 'existing-native-id',
                  providerId: 'MMT_2',
                  ummVersion: mockUmmVersion
                }
              },
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'C1000000-MMT',
                    revisionId: '2'
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        expect(await screen.findByText(/No differences were found between the existing published collection and the staged metadata/)).toBeInTheDocument()
        expect(screen.queryByText(/Review the differences between/)).not.toBeInTheDocument()

        const confirmButton = screen.getByRole('button', { name: 'Save as Draft' })
        await user.click(confirmButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })
      })
    })

    describe('when no matching collection is found', () => {
      test('shows a message explaining no match was found', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 0,
                    items: []
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        expect(await screen.findByText(/No published collection was found with ShortName "Mock Short Name"/)).toBeInTheDocument()
      })
    })

    describe('when more than one matching collection is found', () => {
      test('lets the user choose which collection to target before showing the diff', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 2,
                    items: [
                      {
                        conceptId: 'C1000000-MMT_1',
                        shortName: 'Mock Short Name',
                        version: '1',
                        title: 'First Provider Collection',
                        provider: 'MMT_1',
                        entryTitle: 'First Provider Collection',
                        revisionId: '1',
                        granules: null,
                        tagDefinitions: null,
                        tags: null,
                        revisionDate: '2024-01-01T00:00:00.000Z'
                      },
                      {
                        conceptId: 'C1000000-MMT_2',
                        shortName: 'Mock Short Name',
                        version: '1',
                        title: 'Second Provider Collection',
                        provider: 'MMT_2',
                        entryTitle: 'Second Provider Collection',
                        revisionId: '1',
                        granules: null,
                        tagDefinitions: null,
                        tags: null,
                        revisionDate: '2024-01-01T00:00:00.000Z'
                      }
                    ]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: {
                    nativeId: 'second-native-id',
                    providerId: 'MMT_2',
                    ummMetadata: {
                      EntryTitle: 'Second Provider Collection',
                      ShortName: 'Mock Short Name',
                      Version: '1'
                    }
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Collection',
                  metadata: mockMetadata,
                  nativeId: 'second-native-id',
                  providerId: 'MMT_2',
                  ummVersion: mockUmmVersion
                }
              },
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'C1000000-MMT',
                    revisionId: '2'
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        const secondMatch = await screen.findByLabelText(/Second Provider Collection/)
        await user.click(secondMatch)

        const continueButton = screen.getByRole('button', { name: 'Continue' })
        await user.click(continueButton)

        const confirmButton = await screen.findByRole('button', { name: 'Save as Draft' })
        await user.click(confirmButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/C1000000-MMT')
        })
      })
    })

    describe('when searching for a matching collection results in an error', () => {
      test('shows an error message and calls errorLogger', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'SaveAsDraftToExistingCollectionModal: getCollections')
        })

        expect(await screen.findByText('An error occurred')).toBeInTheDocument()
      })
    })

    describe('when the staged metadata has no ShortName', () => {
      test('shows an error message without searching for a matching collection', async () => {
        getStagedConcept.mockResolvedValue({
          concept: {
            EntryTitle: 'Mock Staged Collection',
            Version: '1'
          }
        })

        // No GET_COLLECTIONS mock is registered -- searching without a ShortName
        // filter would throw an "unmatched mock" error, so registering none here
        // also proves the guard prevents the query from ever being made.
        const { user } = setup()

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        expect(await screen.findByText('The staged metadata is missing a ShortName, so a matching collection could not be searched for.')).toBeInTheDocument()
      })
    })

    describe('when fetching the matching collection results in an error', () => {
      test('shows an error message and calls errorLogger', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Existing Published Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Existing Published Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'SaveAsDraftToExistingCollectionModal: getCollection')
        })

        expect(await screen.findByText('An error occurred')).toBeInTheDocument()
      })
    })

    describe('when the matching collection cannot be retrieved', () => {
      test('shows an error message', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Existing Published Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Existing Published Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: null
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        expect(await screen.findByText('The matching collection could not be retrieved.')).toBeInTheDocument()
      })
    })

    describe('when clicking Close after no match is found', () => {
      test('closes the modal', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 0,
                    items: []
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        await screen.findByText(/No published collection was found with ShortName "Mock Short Name"/)

        const closeButton = screen.getByRole('button', { name: 'Close' })
        await user.click(closeButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when clicking Cancel while choosing among multiple matches', () => {
      test('closes the modal', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 2,
                    items: [
                      {
                        conceptId: 'C1000000-MMT_1',
                        shortName: 'Mock Short Name',
                        version: '1',
                        title: 'First Provider Collection',
                        provider: 'MMT_1',
                        entryTitle: 'First Provider Collection',
                        revisionId: '1',
                        granules: null,
                        tagDefinitions: null,
                        tags: null,
                        revisionDate: '2024-01-01T00:00:00.000Z'
                      },
                      {
                        conceptId: 'C1000000-MMT_2',
                        shortName: 'Mock Short Name',
                        version: '1',
                        title: 'Second Provider Collection',
                        provider: 'MMT_2',
                        entryTitle: 'Second Provider Collection',
                        revisionId: '1',
                        granules: null,
                        tagDefinitions: null,
                        tags: null,
                        revisionDate: '2024-01-01T00:00:00.000Z'
                      }
                    ]
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        await screen.findByLabelText(/Second Provider Collection/)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when clicking Cancel on the diff view', () => {
      test('closes the modal without confirming', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Existing Published Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Existing Published Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: {
                    nativeId: 'existing-native-id',
                    providerId: 'MMT_2',
                    ummMetadata: {
                      EntryTitle: 'Existing Published Collection',
                      ShortName: 'Mock Short Name',
                      Version: '1'
                    }
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when closing the modal via the X button once a match is loaded', () => {
      test('closes the modal', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 1,
                    items: [{
                      conceptId: 'C1000000-MMT_2',
                      shortName: 'Mock Short Name',
                      version: '1',
                      title: 'Existing Published Collection',
                      provider: 'MMT_2',
                      entryTitle: 'Existing Published Collection',
                      revisionId: '3',
                      granules: null,
                      tagDefinitions: null,
                      tags: null,
                      revisionDate: '2024-01-01T00:00:00.000Z'
                    }]
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION,
                variables: { params: { conceptId: 'C1000000-MMT_2' } }
              },
              result: {
                data: {
                  collection: {
                    nativeId: 'existing-native-id',
                    providerId: 'MMT_2',
                    ummMetadata: {
                      EntryTitle: 'Existing Published Collection',
                      ShortName: 'Mock Short Name',
                      Version: '1'
                    }
                  }
                }
              }
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        await screen.findByRole('button', { name: 'Save as Draft' })

        const closeIconButton = screen.getByRole('button', { name: 'X icon Close' })
        await user.click(closeIconButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when pressing Escape while still searching for a match', () => {
      test('does not close the modal', async () => {
        const { user } = setup({
          mocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: { params: { shortName: 'Mock Short Name' } }
              },
              result: {
                data: {
                  collections: {
                    count: 0,
                    items: []
                  }
                }
              },
              // Delays resolution so the modal is still in the 'searching' status when Escape is pressed
              delay: 50
            }
          ]
        })

        const saveToExistingButton = await screen.findByRole('button', { name: /Save as Draft to Existing Collection/ })
        await user.click(saveToExistingButton)

        expect(await screen.findByRole('dialog')).toBeInTheDocument()

        await user.keyboard('{Escape}')

        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })
})
