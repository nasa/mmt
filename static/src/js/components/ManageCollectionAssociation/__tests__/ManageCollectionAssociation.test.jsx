import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'
import ManageCollectionAssociation from '../ManageCollectionAssociation'

import {
  deleteAssociationResponse,
  deletedAssociationResponse,
  sortProvider,
  sortVariableRecord,
  toolRecordSearch,
  toolRecordSearchError,
  toolRecordSortSearch,
  variableRecord
} from './__mocks__/manageCollectionAssociationResults'
import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import errorLogger from '../../../utils/errorLogger'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import { DELETE_ASSOCIATION } from '../../../operations/mutations/deleteAssociation'

vi.mock('../../../utils/errorLogger')
vi.mock('../../../components/ErrorBanner/ErrorBanner')

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

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        }
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/T1200000-TEST/collection-association']}>
          <MockedProvider
            mocks={overrideMocks || mocks}
            defaultOptions={
              {
                query: {
                  fetchPolicy: 'no-cache'
                },
                watchQuery: {
                  fetchPolicy: 'no-cache'
                }
              }
            }
          >
            <Routes>
              <Route
                path={overridePaths || 'tools/:conceptId/collection-association'}
                element={
                  (
                    <Suspense>
                      <ManageCollectionAssociation />
                    </Suspense>
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
    user: userEvent.setup()
  }
}

describe('ManageCollectionAssociation', () => {
  describe('when the collection association page is requested', () => {
    test('renders the collection association page with the associated collections', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('Showing 2 Collection Association')).toBeInTheDocument()
      expect(screen.getByText('CIESIN_SEDAC_ESI_2000')).toBeInTheDocument()
      expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
    })
  })

  describe.skip('when the request results in an error', () => {
    test('should call errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [toolRecordSearchError]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get draft', 'Manage Collection Association: getMetadata Query')
      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when disassociation associated collection', () => {
    describe('when selecting and clicking on Delete Selected Collection', () => {
      test('should show the delete modal and click no', async () => {
        const { user } = setup({})

        await waitForResponse()

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        await waitForResponse()

        expect(screen.getByText('Showing 2 Collection Association')).toBeInTheDocument()
        expect(screen.getByText('CIESIN_SEDAC_ESI_2000')).toBeInTheDocument()
        expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
      })
    })

    describe('when disassociation a collection but no collections are selected', () => {
      test('should show an error', async () => {
        const { user } = setup({})

        await waitForResponse()

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('Showing 2 Collection Association')).toBeInTheDocument()
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
                collectionConceptIds: [{ conceptId: 'C120000001_TEST' }],
                conceptType: 'Tool'
              }
            },
            error: new Error('An error occurred')
          }]
        })

        await waitForResponse()

        const firstCheckbox = screen.getAllByRole('checkbox')[0]
        const secondCheckbox = screen.getAllByRole('checkbox')[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to disassociate collection record for Tool', 'Manage Collection Association: deleteAssociation Mutation')
      })
    })

    describe('when selecting Yes in the modal and results in a success ', () => {
      test('should remove the deleted collection', async () => {
        const { user } = setup({
          additionalMocks: [deleteAssociationResponse, deletedAssociationResponse]
        })

        await waitForResponse()

        const firstCheckbox = screen.getAllByRole('checkbox')[0]

        await user.click(firstCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected collection associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(screen.getByText('CIESIN_SEDAC_ESI_2001')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking on refresh button', () => {
    test('should call getMetadata() again', async () => {
      const { user } = setup({
        additionalMocks: [toolRecordSearch]
      })

      await waitForResponse()

      const refreshButton = screen.getByRole('link', { name: 'refresh the page' })

      await user.click(refreshButton)

      await waitForResponse()

      expect(screen.getByText('CIESIN_SEDAC_ESI_2000')).toBeInTheDocument()
    })
  })

  describe('when clicking on Add Collection Associations button', () => {
    test('should navigate to collection-search', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})
      await waitForResponse()

      const addCollectionAssociationButton = screen.getByRole('button', { name: 'Add Collection Associations' })

      await user.click(addCollectionAssociationButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1200000-TEST/collection-association-search')
    })
  })

  describe('sorting tool record', () => {
    test('when there is sortKey present in the search param', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association?sortKey=-provider'],
        overrideMocks: [toolRecordSortSearch, toolRecordSortSearch]
      })

      await waitForResponse()

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Sort Provider in ascending order/ })
      await user.click(button)

      await waitForResponse()

      expect(screen.queryByRole('button', { name: /Sort Provider in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })

    test('when sorting by providerId', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association'],
        additionalMocks: [toolRecordSortSearch]
      })

      await waitForResponse()

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Sort Provider in ascending order/ })
      await user.click(button)

      await waitForResponse()

      expect(screen.queryByRole('button', { name: /Sort Provider in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })

    test('when sorting by shortName', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1200000-TEST/collection-association']
      })

      await waitForResponse()

      await waitForResponse()

      const test = screen.getByRole('button', { name: /Sort Short Name in ascending order/ })
      await user.click(test)

      await waitForResponse()

      expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })

  describe('when the conceptType is a variable', () => {
    test('should render variable table', async () => {
      setup({
        overrideInitialEntries: ['/variables/V1200000104-SEDAC/collection-association'],
        overridePaths: 'variables/:conceptId/collection-association',
        overrideMocks: [variableRecord]
      })

      await waitForResponse()

      expect(screen.getByText('CIESIN_SEDAC_ESI_2002')).toBeInTheDocument()
    })

    describe('when clicking an ascending sort button for variable', () => {
      test('sorts short name and show the button as active', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/variables/V1200000104-SEDAC/collection-association'],
          overridePaths: 'variables/:conceptId/collection-association',
          overrideMocks: [variableRecord, sortVariableRecord]
        })

        await waitForResponse()

        const button = screen.getByRole('button', { name: /Sort Short Name in ascending order/ })
        await user.click(button)

        await waitForResponse()

        expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
      })

      describe('when clicking an ascending sort button', () => {
        test('sorts provider and show the button as active', async () => {
          const { user } = setup({
            overrideInitialEntries: ['/variables/V1200000104-SEDAC/collection-association'],
            overridePaths: 'variables/:conceptId/collection-association',
            overrideMocks: [variableRecord, sortProvider]
          })

          await waitForResponse()

          const button = screen.getByRole('button', { name: /Sort Provider in ascending order/ })
          await user.click(button)

          await waitForResponse()

          expect(screen.queryByRole('button', { name: /Sort Provider in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
        })
      })
    })
  })
})
