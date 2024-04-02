import { render, screen } from '@testing-library/react'
import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import * as router from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import CollectionAssociationForm from '../CollectionAssociationForm'
import { GET_COLLECTIONS } from '../../../operations/queries/getCollections'
import {
  CollectionAssociationRequest,
  CollectionResultsWithPages,
  createAssociationErrorRequest,
  createAssociationRequest,
  ingestVariableErrorRequest,
  ingestVariableRequest,
  mockTool,
  mockVariableDraft,
  mockVariable,
  mockToolWithAssociation,
  ingestVariableDraftResponse,
  ingestVariableDraftErrorResponse,
  CollectionSortRequest
} from './__mocks__/CollectionAssociationResults'
import errorLogger from '../../../utils/errorLogger'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'

vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overridePath,
  overrideMock
}) => {
  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        },
        keywords: {}
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/TL12000000-MMT_2/collection-association-search']}>
          <MockedProvider
            mocks={additionalMocks}
          >
            <Routes>
              <Route
                path={overridePath || 'tools/:conceptId/collection-association-search'}
                element={<CollectionAssociationForm metadata={overrideMock || mockTool} />}
              />
            </Routes>
          </MockedProvider>
        </MemoryRouter>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('CollectionAssociationForm', () => {
  describe('when searching for collection', () => {
    test('renders a list of collection', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest],
        overrideMock: mockToolWithAssociation
      })

      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await waitForResponse()

      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      const secondCheckbox = screen.getAllByRole('checkbox')[1]

      await user.click(secondCheckbox)
      await user.click(firstCheckbox)
      await user.click(secondCheckbox)

      expect(errorLogger).toHaveBeenCalledTimes(0)
    })

    test('when there an error to get the list of collections', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 20,
                offset: 0,
                provider: 'MMT_2',
                sortKey: null,
                options: { entryTitle: { pattern: true } },
                entryTitle: '*'
              }
            }
          },
          error: new Error('An error occurred')
        }]
      })
      await waitForResponse()
      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get Collections', 'Collection Association: getCollections Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })

    describe('when searching for temporal extent', () => {
      // Todo:
      // Spent part of afternoon with Deep, no resolution on this
      // test below.
      // For whatever reason the test below is not working on
      // intel (older  machines), works fine on Deep's machine (silicon)
      // though.   Maybe some kind of race condition?
      // (verified same version of node, npm, env vars, etc.)
      // Also strange test works fine running as a single file, just does
      // not work when run in the full test suite (e.g. npm run test)
      // Need to revisit this.
      test.skip('show fill out temporal extent form', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
                    options: { entryTitle: { pattern: true } },
                    entryTitle: '*'
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'C12000001123-MMT_2',
                        provider: 'MMT_2',
                        version: '1',
                        revisionId: 1,
                        tags: 1,
                        granules: null,
                        entryTitle: 'Collection Association Entry Title 1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        revisionDate: null,
                        tagDefinitions: {
                          items: [{
                            conceptId: 'C100000',
                            description: 'Mock tag description',
                            originatorId: 'test.user',
                            revisionId: '1',
                            tagKey: 'Mock tag key'
                          }]
                        },
                        __typename: 'Collection'
                      }
                    ],
                    count: 25,
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
                    temporal: '1978-01-01T00:00:00.000Z,1978-01-01T00:00:00.000Z'
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'C12000001123-MMT_2',
                        provider: 'MMT_2',
                        version: '1',
                        tags: 1,
                        revisionId: 1,
                        granules: null,
                        entryTitle: 'Collection Association Entry Title 1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        revisionDate: null,
                        tagDefinitions: {
                          items: [{
                            conceptId: 'C100000',
                            description: 'Mock tag description',
                            originatorId: 'test.user',
                            revisionId: '1',
                            tagKey: 'Mock tag key'
                          }]
                        },
                        __typename: 'Collection'
                      }
                    ],
                    count: 25,
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Variable',
                  metadata: {
                    _private: {
                      CollectionAssociation: {
                        collectionConceptId: 'C12000001123-MMT_2',
                        shortName: 'Collection Associations Short Name 1',
                        version: '1'
                      }
                    }
                  },
                  ummVersion: '1.9.0'
                }
              },
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'VD120000000-MMT_2',
                    revisionId: '3'
                  }
                }
              }
            }
          ]
        })
        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')
        await user.click(searchField)

        const selectField = screen.getByText('Temporal Extent')
        await user.click(selectField)
        await waitForResponse()

        const startField = screen.getByText('Range Start')
        await user.type(startField, '1978-01-01T00:00:00Z')

        const endField = screen.getByText('Range End')
        await user.type(endField, '1978-01-01T00:00:00Z')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        expect(screen.getByText('Collection Associations Short Name 1')).toBeInTheDocument()
      })
    })
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest, CollectionResultsWithPages]
      })
      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)
      await waitForResponse()

      const paginationButton = screen.getByRole('button', { name: 'Goto Page 3' })
      await user.click(paginationButton)

      expect(screen.getByText('Collection Associations Short Name 1')).toBeInTheDocument()
    })
  })

  describe('when associating a collection to a tool', () => {
    test('should associate and redirect to manage association page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest, createAssociationRequest]
      })

      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await waitForResponse()
      const firstCheckbox = screen.getAllByRole('checkbox')[1]

      await user.click(firstCheckbox)
      await waitForResponse()

      const createSelectedAssociationButton = screen.getByRole('button', { name: 'Associate Selected Collections' })

      await user.click(createSelectedAssociationButton)

      expect(navigateSpy).toHaveBeenCalledTimes(2)
      // Expect(navigateSpy).toHaveBeenCalledWith('/tools/TL12000000-MMT_2/collection-association')
    })
  })

  describe('when the create association request fails', () => {
    test('should call errorLogger and display error message', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest, createAssociationErrorRequest]
      })

      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await waitForResponse()

      const firstCheckbox = screen.getAllByRole('checkbox')[0]

      await user.click(firstCheckbox)
      await user.click(firstCheckbox)
      await user.click(firstCheckbox)

      const createSelectedAssociationButton = screen.getByRole('button', { name: 'Associate Selected Collections' })

      await user.click(createSelectedAssociationButton)

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to create association', 'Collection Association Form: createAssociationForm')
    })
  })

  describe('when updating a variable collection association', () => {
    describe('updating variable collection association results in a success', () => {
      test('should update and navigate to collection-association', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [CollectionAssociationRequest, ingestVariableRequest],
          overrideMock: { mockVariable },
          overridePath: 'variables/:conceptId/collection-association-search',
          overrideInitialEntries: ['/variables/V12000000-MMT_2/collection-association-search']
        })

        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')

        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        await waitForResponse()
        const createAssociationButton = screen.getAllByRole('button', { name: 'Create Association' })

        await user.click(createAssociationButton[0])

        expect(navigateSpy).toHaveBeenCalledTimes(2)
        expect(navigateSpy).toHaveBeenCalledWith('/variables/V12000000-MMT_2/collection-association')
      })
    })

    describe('updating a variable collection association results in a error', () => {
      test('should call errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [CollectionAssociationRequest, ingestVariableErrorRequest],
          overrideMock: { mockVariable },
          overridePath: 'variables/:conceptId/collection-association-search',
          overrideInitialEntries: ['/variables/V12000000-MMT_2/collection-association-search']
        })

        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')

        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        await waitForResponse()

        const createAssociationButton = screen.getAllByRole('button', { name: 'Create Association' })

        await user.click(createAssociationButton[0])

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to update association', 'Collection Association Form: createAssociationForm')
      })
    })
  })

  describe('when creating a collection association for variable draft', () => {
    describe('creates an collection association', () => {
      test('should associate the collection to the draft and navigate', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [CollectionAssociationRequest, ingestVariableDraftResponse],
          overrideMock: { mockVariableDraft },
          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association'],
          overridePath: '/drafts/variables/:conceptId/collection-association'
        })
        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')
        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)
        await waitForResponse()

        const createAssociationButton = screen.getAllByRole('button', { name: 'Create Association' })

        await user.click(createAssociationButton[0])

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(2)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/variables/VD120000000-MMT_2')
      })
    })

    describe('when creating variable draft association results in an error', () => {
      test('should call the errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [CollectionAssociationRequest, ingestVariableDraftErrorResponse],
          overrideMock: { mockVariableDraft },

          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association'],
          overridePath: '/drafts/variables/:conceptId/collection-association'
        })
        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')
        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)
        await waitForResponse()

        const createAssociationButton = screen.getAllByRole('button', { name: 'Create Association' })

        await user.click(createAssociationButton[0])

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
      })
    })
  })

  describe('when clicking an ascending sort button', () => {
    test('should sorts and shows the button as active', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest]
      })

      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)
      await waitForResponse()

      const sortShortName = screen.getByRole('button', { name: /Sort Short Name in ascending order/ })
      await user.click(sortShortName)
      expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })

  describe('when the URL searchParam', () => {
    test('should search for collection', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      setup({
        additionalMocks: [CollectionSortRequest],
        overrideMock: { mockVariable },
        overridePath: 'variables/:conceptId/collection-association-search',
        overrideInitialEntries: ['/variables/V12000000-MMT_2/collection-association-search?searchField=entryTitle&searchFieldValue=*&sortKey=-shortName']
      })

      await waitForResponse()

      expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })
})
