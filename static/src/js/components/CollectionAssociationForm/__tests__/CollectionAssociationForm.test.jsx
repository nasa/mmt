import {
  render,
  screen,
  within
} from '@testing-library/react'
import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import * as router from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'

import moment from 'moment'

import AppContext from '@/js/context/AppContext'
import NotificationsContext from '@/js/context/NotificationsContext'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'

import errorLogger from '@/js/utils/errorLogger'

import { DATE_FORMAT } from '@/js/constants/dateFormat'
import CollectionAssociationForm from '../CollectionAssociationForm'

import {
  CollectionAssociationRequest,
  CollectionResultsWithPages,
  createAssociationErrorRequest,
  createAssociationRequest,
  createAssociationWithServiceRequest,
  mockTool,
  mockVariable,
  mockToolWithAssociation,
  mockOrderOption,
  CollectionSortRequest,
  GetServicesRequest,
  GetServicesPagedRequest
} from './__mocks__/CollectionAssociationResults'

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overridePath,
  overrideMock
}) => {
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
        <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/T12000000-MMT_2/collection-association-search']}>
          <MockedProvider
            mocks={[GetServicesRequest, GetServicesPagedRequest, ...additionalMocks]}
          >
            <Routes>
              <Route
                path={overridePath || 'tools/:conceptId/collection-association-search'}
                element={<CollectionAssociationForm metadata={overrideMock || mockTool} />}
              />
              <Route
                path={overridePath || 'order-options/:conceptId/collection-association-search'}
                element={<CollectionAssociationForm metadata={overrideMock || mockOrderOption} />}
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

describe('CollectionAssociationForm', () => {
  describe('when searching for collection', () => {
    test('renders a list of collection', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest],
        overrideMock: mockToolWithAssociation
      })

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const firstCheckbox = screen.getAllByRole('checkbox')[0]
      const secondCheckbox = screen.getAllByRole('checkbox')[1]

      await user.click(secondCheckbox)
      await user.click(firstCheckbox)
      await user.click(secondCheckbox)

      expect(errorLogger).toHaveBeenCalledTimes(0)
    })

    test('when there is an error to get the list of collections', async () => {
      const { user } = setup({
        additionalMocks: [{
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
        }]
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

    describe('when searching for temporal extent', () => {
      test('show fill out temporal extent form', async () => {
        const { user } = setup({
          additionalMocks: [
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
            }
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
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest, CollectionResultsWithPages]
      })

      const searchField = await screen.findByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const paginationButton = screen.getByRole('button', { name: 'Goto Page 3' })
      await user.click(paginationButton)

      expect(await screen.findByText('Collection Associations Short Name 1')).toBeInTheDocument()
    })
  })

  describe('when associating a collection to a tool', () => {
    test('should associate and redirect to manage association page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [CollectionAssociationRequest, createAssociationRequest]
      })

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
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T12000000-MMT_2/collection-association')
    })
  })

  describe('when supplying a service when associating a collection and order option', () => {
    test('should associate and redirect to order option page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideInitialEntries: ['/order-options/OO1257381321-EDF_OPS/collection-association-search'],
        additionalMocks: [CollectionAssociationRequest, createAssociationWithServiceRequest]
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
        additionalMocks: [CollectionAssociationRequest, createAssociationErrorRequest]
      })

      const searchField = await screen.findByText('Select Search Field')

      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      const firstCheckbox = screen.getAllByRole('checkbox')[0]

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
        additionalMocks: [CollectionAssociationRequest]
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

      const sortButton = await screen.findByRole('button', { name: /Sort Short Name in ascending order/ })
      expect(sortButton).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })
})
