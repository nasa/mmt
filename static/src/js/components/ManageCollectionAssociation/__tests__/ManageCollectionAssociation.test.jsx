import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'
import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client'

import NotificationsContext from '@/js/context/NotificationsContext'
import errorLogger from '@/js/utils/errorLogger'
import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import ManageCollectionAssociation from '../ManageCollectionAssociation'

import {
  deleteAssociationResponse,
  deletedAssociationResponse,
  toolRecordSearch,
  toolRecordSearchNoAssociatedCollections,
  toolRecordSearchTestPage,
  toolRecordSearchwithPages,
  toolRecordSortSearch
} from './__mocks__/manageCollectionAssociationResults'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  overrideInitialEntries,
  overridePaths
}) => {
  const mocks = [
    toolRecordSearch,
    ...additionalMocks
  ]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/T1200000-TEST/collection-association']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
          cache={
            new InMemoryCache({
              dataIdFromObject: (object) => {
                const { __typename: typeName, conceptId } = object
                if ([
                  'Acl',
                  'Collection',
                  'Draft',
                  'Grid',
                  'OrderOption',
                  'Permission',
                  'Service',
                  'Subscription',
                  'Tool',
                  'Variable'
                ].includes(typeName)) {
                  return conceptId
                }

                return defaultDataIdFromObject(object)
              }
            })
          }
        >
          <Routes>
            <Route
              path={overridePaths || 'tools/:conceptId/collection-association'}
              element={
                (
                  <ErrorBoundary>
                    <Suspense>
                      <ManageCollectionAssociation />
                    </Suspense>
                  </ErrorBoundary>
                )
              }
            />
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    </NotificationsContext.Provider>
  )

  return {
    user
  }
}

describe('ManageCollectionAssociation', () => {
  describe('when the collection association page is requested', () => {
    test('renders the collection association page with the associated collections', async () => {
      setup({
        overrideMocks: [toolRecordSearch]
      })

      expect(await screen.findByText('Showing 2 Collection Associations')).toBeInTheDocument()
      expect(screen.getByText('CIESIN_SEDAC_ESI_2000')).toBeInTheDocument()
      expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
    })
  })

  describe('when the collection association page is requested but the record has no associations', () => {
    test('renders the collection association page with message ', async () => {
      setup({
        overrideMocks: [toolRecordSearchNoAssociatedCollections]
      })

      await screen.findByText('No collection associations found.')
      expect(screen.getByText('No collection associations found.')).toBeInTheDocument()
    })
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        overrideMocks: [toolRecordSearchTestPage, toolRecordSearchwithPages]
      })

      expect(await screen.findByText('Showing 1-20 of 50 Collection Associations'))

      // Find the "Next" button in the new pagination structure
      const nextPageButtons = screen.getAllByRole('button', { name: 'Goto Next Page' })
      await user.click(nextPageButtons[0])

      expect(await screen.findByText('Showing 21-40 of 50 Collection Associations'))
    })
  })

  describe('when disassociation associated collection', () => {
    describe('when selecting and clicking on Delete Selected Collection', () => {
      test('should show the delete modal and click no', async () => {
        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_ASSOCIATION,
              variables: {
                conceptId: 'T1200000-TEST',
                associatedConceptIds: ['C120000001-TEST']
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]
        const secondCheckbox = checkboxes[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(await screen.findByText('Showing 2 Collection Associations')).toBeInTheDocument()
        expect(screen.getByText('CIESIN_SEDAC_ESI_2000')).toBeInTheDocument()
        expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
      })
    })

    describe('when selecting Yes in the modal and results in an error ', () => {
      test('should call errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_ASSOCIATION,
              variables: {
                conceptId: 'T1200000-TEST',
                associatedConceptIds: ['C120000001-TEST']
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]
        const secondCheckbox = checkboxes[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith('Unable to disassociate collection record for Tool', 'Manage Collection Association: deleteAssociation Mutation')
        })

        expect(errorLogger).toHaveBeenCalledTimes(1)
      })
    })

    describe('when selecting Yes in the modal and results in a success ', () => {
      test('should remove the deleted collection', async () => {
        const { user } = setup({
          overrideMocks: [
            deletedAssociationResponse,
            deleteAssociationResponse,
            deletedAssociationResponse
          ]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]

        await user.click(firstCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking on Add Collection Associations button', () => {
    test.skip('should navigate to collection-search', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})

      const addCollectionAssociationButton = await screen.findByRole('button', { name: 'Add Collection Associations' })

      await user.click(addCollectionAssociationButton)

      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1200000-TEST/collection-association-search')
      expect(navigateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('sorting tool record', () => {
    test('when there is sortKey present in the search param', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association?sortKey=-provider'],
        overrideMocks: [toolRecordSortSearch]
      })

      const button = await screen.findByRole('button', { name: /Sort Provider in ascending order/ })
      await user.click(button)

      expect(await screen.findByRole('button', { name: /Sort Provider in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })

    test('when sorting by providerId', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association'],
        additionalMocks: [toolRecordSortSearch]
      })

      const button = await screen.findByRole('button', { name: /Sort Provider in ascending order/ })
      await user.click(button)

      expect(await screen.findByRole('button', { name: /Sort Provider in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })

    test('when sorting by shortName', async () => {
      const { user } = setup({
        overrideMocks: [toolRecordSearch, {
          request: {
            ...toolRecordSortSearch.request,
            variables: {
              ...toolRecordSortSearch.request.variables,
              collectionsParams: {
                limit: 20,
                offset: 0,
                sortKey: 'shortName'
              }
            }
          },
          result: toolRecordSortSearch.result
        }],
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association?sortKey=shortName']
      })

      const test = await screen.findByRole('button', { name: /Sort Short Name in descending order/ })
      await user.click(test)

      expect(await screen.findByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })
})
