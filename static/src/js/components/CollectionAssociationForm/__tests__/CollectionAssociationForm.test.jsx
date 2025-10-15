import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'

import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'
import * as router from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'

import moment from 'moment'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'

import { DATE_FORMAT } from '@/js/constants/dateFormat'

import AppContext from '@/js/context/AppContext'
import NotificationsContext from '@/js/context/NotificationsContext'

import errorLogger from '@/js/utils/errorLogger'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import CollectionAssociationForm from '../CollectionAssociationForm'

import {
  createAssociationErrorRequest,
  createAssociationRequest,
  createAssociationWithServiceRequest,
  getCollectionsMock,
  getCollectionsMockPage1,
  getCollectionsMockPage2,
  getCollectionSortRequestByProvider,
  getCollectionSortRequestByShortName,
  getServices,
  getToolMock,
  getToolMockWithError,
  mockNoCollections,
  mockOrderOption
} from './__mocks__/CollectionAssociationResults'

vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overridePath,
  overrideMocks
}) => {
  const mocks = [
    getToolMock,
    getCollectionsMock,
    getToolMock,
    ...additionalMocks
  ]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <AppContext.Provider value={
      {
        providerId: 'MMT_2',
        keywords: {}
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/T1200000098-MMT_2/collection-association-search']}>
          <MockedProvider mocks={overrideMocks || mocks}>
            <Routes>
              <Route
                path={overridePath || 'tools/:conceptId/collection-association-search'}
                element={
                  (
                    <ErrorBoundary>
                      <Suspense fallback="Loading...">
                        <CollectionAssociationForm />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
              <Route
                path={overridePath || 'order-options/:conceptId/collection-association-search'}
                element={
                  (
                    <ErrorBoundary>
                      <Suspense fallback="Loading...">
                        <CollectionAssociationForm />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
            </Routes>
          </MockedProvider>
        </MemoryRouter>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user
  }
}

describe('CollectionAssociationForm component', () => {
  describe('when the component mounts', () => {
    test('it should render the search form', async () => {
      const { user } = setup({})

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchButton = await screen.findByText('Search for Collection')
      expect(searchButton).toBeEnabled()
      await user.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText('Collection Associations Entry Title 1')).toBeInTheDocument()
      })

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1])
      await user.click(checkboxes[0])
      await user.click(checkboxes[1])

      expect(errorLogger).toHaveBeenCalledTimes(0)
    })

    test('when there is an error to get the list of collections', async () => {
      const { user } = setup({
        overrideMocks: [
          getToolMock,
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  provider: null,
                  sortKey: null,
                  options: { entryTitle: { pattern: true } },
                  entryTitle: '*'
                }
              }
            },
            error: new Error('An error occurred')
          },
          getToolMock
        ]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get Collections', 'Collection Association: getCollections Query')
    })

    test('when there is an error to get the concept', async () => {
      const { user } = setup({
        overrideMocks: [getToolMockWithError]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      expect(errorLogger).toHaveBeenCalledTimes(2)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get Collections', 'Collection Association: getCollections Query')
    })

    test('when there are no collections found', async () => {
      const { user } = setup({
        overrideMocks: [
          getToolMock,
          mockNoCollections,
          getToolMock
        ]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await screen.findByText('No Collections Found.')
    })
  })

  describe('when searching for temporal extent', () => {
    test('show fill out temporal extent form', async () => {
      const { user } = setup({
        overrideMocks: [
          getToolMock,
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  provider: null,
                  sortKey: null,
                  temporal: '1978-01-01T00:00:00.000,1978-01-01T00:00:00.000'
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
          getToolMock
        ]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Temporal Extent')
      await user.click(selectField)

      const startField = screen.getByText('Range Start')
      await user.type(startField, moment.utc('1978-01-01T00:00:00Z').format(DATE_FORMAT))

      const endField = screen.getByText('Range End')
      await user.type(endField, moment.utc('1978-01-01T00:00:00Z').format(DATE_FORMAT))

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(2)

      const row1 = tableRows[1]
      const row1Cells = within(row1).queryAllByRole('cell')

      expect(row1Cells[1].textContent).toBe('Collection Association Entry Title 1')
    })
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        overrideMocks: [
          getToolMock,
          getCollectionsMockPage1,
          getToolMock,
          getCollectionsMockPage2]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      // Wait for the initial results to load
      await screen.findByText('Showing 1-20 of 50 Collections')

      // Find the "Next" button in the new pagination structure
      const nextPageButtons = screen.getAllByRole('button', { name: 'Goto Next Page' })
      await user.click(nextPageButtons[0])

      // Check if the page has changed by looking for a specific element on the new page
      expect(await screen.findByText('Showing 21-40 of 50 Collections')).toBeInTheDocument()
    })
  })

  describe('when associating a collection to a tool', () => {
    test('should associate and redirect to manage association page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideMocks: [
          getToolMock,
          getCollectionsMock,
          getToolMock,
          createAssociationRequest
        ]
      })

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await screen.findByText('Unassociated Collection Entry Title 1')

      const firstCheckbox = screen.getAllByRole('checkbox')[1]

      await user.click(firstCheckbox)

      const createSelectedAssociationButton = screen.getByRole('button', { name: 'Associate Selected Collections' })

      await user.click(createSelectedAssociationButton)

      expect(navigateSpy).toHaveBeenCalledTimes(2)
      expect(navigateSpy).toHaveBeenNthCalledWith(1, '?searchField=entryTitle&searchFieldValue=*', undefined)
      expect(navigateSpy).toHaveBeenNthCalledWith(2, '/tools/T1200000098-MMT_2/collection-association')
    })
  })

  describe('when supplying a service when associating a collection and order option', () => {
    test('should associate and redirect to order option page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideInitialEntries: ['/order-options/OO1257381321-EDF_OPS/collection-association-search'],
        overrideMocks: [
          getServices,
          mockOrderOption,
          getCollectionsMockPage1,
          createAssociationWithServiceRequest]
      })

      const serviceField = await screen.findByText('Select Service')
      await user.click(serviceField)
      const option = screen.getByRole('option', { name: 'Service Name 1' })
      await user.click(option)

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const firstCheckbox = screen.getAllByRole('checkbox')[1]
      await user.click(firstCheckbox)

      const createSelectedAssociationButton = screen.getByRole('button', { name: 'Associate Selected Collections' })

      await user.click(createSelectedAssociationButton)

      expect(navigateSpy).toHaveBeenCalledTimes(2)
      expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1257381321-EDF_OPS')
    })
  })

  describe('when the create association request fails', () => {
    test('should call errorLogger and display error message', async () => {
      const { user } = setup({
        overrideMocks: [
          getToolMock,
          getCollectionsMock,
          getToolMock,
          createAssociationErrorRequest
        ]
      })

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await screen.findByText('Unassociated Collection Entry Title 1')

      const firstCheckbox = screen.getAllByRole('checkbox')[1]

      await user.click(firstCheckbox)
      await user.click(firstCheckbox)
      await user.click(firstCheckbox)

      const createSelectedAssociationButton = screen.getByRole('button', { name: 'Associate Selected Collections' })

      await user.click(createSelectedAssociationButton)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to create association', 'Collection Association Form: createAssociationForm')
    })
  })

  describe('when clicking an ascending sort button', () => {
    test('should sorts and shows the button as active', async () => {
      const { user } = setup({
        additionalMocks: [getCollectionSortRequestByShortName, getCollectionSortRequestByProvider]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const sortShortName = screen.getByRole('button', { name: /Sort Short Name in ascending order/ })
      await user.click(sortShortName)
      expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')

      const sortProvider = screen.getByRole('button', { name: /Sort Provider in descending order/ })
      await user.click(sortProvider)
      expect(screen.queryByRole('button', { name: /Sort Provider in descending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })
})
