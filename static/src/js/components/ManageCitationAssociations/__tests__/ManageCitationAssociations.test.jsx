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

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import errorLogger from '@/js/utils/errorLogger'
import NotificationsContext from '@/js/context/NotificationsContext'

import {
  deleteAssociationsError,
  deleteAssociationResponse,
  citationAssociationsSearch,
  citationAssociationsSearchZero,
  citationAssociationsSearchPage1,
  citationAssociationsSearchPage2
} from './__mocks__/citationAssociationsResponses'

import ManageCitationAssociations from '../ManageCitationAssociations'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overrideMocks = false,
  overridePaths
}) => {
  const mocks = [
    citationAssociationsSearch,
    ...additionalMocks
  ]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MemoryRouter initialEntries={overrideInitialEntries || ['/collections/C00000001-TESTPROV/citation-associations']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path={overridePaths || 'collections/:conceptId/citation-associations'}
              element={
                (
                  <ErrorBoundary>
                    <Suspense>
                      <ManageCitationAssociations />
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

describe('ManageCitationAssociation', () => {
  describe('when the citation association page is requested', () => {
    test('renders the citation association page with the associated citations', async () => {
      setup({})

      expect(await screen.findByText('Showing 2 citation associations')).toBeInTheDocument()
      expect(screen.getByText('Citation 1')).toBeInTheDocument()
      expect(screen.getByText('Citation 2')).toBeInTheDocument()
      expect(screen.getByText('citation1')).toBeInTheDocument()
      expect(screen.getByText('citation2')).toBeInTheDocument()
      expect(screen.getByText('DOI')).toBeInTheDocument()
      expect(screen.getByText('ISBN')).toBeInTheDocument()
      expect(screen.getByText('MMT_1')).toBeInTheDocument()
      expect(screen.getByText('MMT_2')).toBeInTheDocument()
    })
  })

  describe('when the citation association page is requested with zero associations', () => {
    test('renders the citation association page with no associated citations found', async () => {
      setup({ overrideMocks: [citationAssociationsSearchZero] })

      expect(await screen.findByText('No citation associations found')).toBeInTheDocument()
    })
  })

  describe('when the citation association page is requested with more than 10 associations', () => {
    test('renders the citation association page with a 2nd page', async () => {
      const { user } = setup({
        overrideMocks: [citationAssociationsSearchPage1, citationAssociationsSearchPage2]
      })

      expect(await screen.findByText('Showing 1-10 of 12 citation associations')).toBeInTheDocument()

      const nextPageButtons = screen.getAllByRole('button', { name: 'Goto Next Page' })
      await user.click(nextPageButtons[0])

      expect(await screen.findByText('Showing 11-12 of 12 citation associations')).toBeInTheDocument()
    })
  })

  describe('when disassociating an associated citation', () => {
    describe('when selecting and clicking on Delete Selected Citation', () => {
      test('should show the delete modal and click no', async () => {
        const { user } = setup({
          additionalMocks: [deleteAssociationResponse]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]
        const secondCheckbox = checkboxes[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected citation associations?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(await screen.findByText('Showing 2 citation associations')).toBeInTheDocument()
        expect(screen.getByText('Citation 1')).toBeInTheDocument()
        expect(screen.getByText('Citation 2')).toBeInTheDocument()
      })
    })

    describe('when selecting Yes in the modal and results in an error ', () => {
      test('should call errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [citationAssociationsSearch, deleteAssociationsError]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]
        const secondCheckbox = checkboxes[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected citation associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith('Unable to disassociate citation record for C00000001-TESTPROV', 'Manage Citation Association: deleteAssociation Mutation')
        })

        expect(errorLogger).toHaveBeenCalledTimes(1)
      })
    })

    describe('when selecting Yes in the modal and results in a success ', () => {
      test('should remove the deleted citation', async () => {
        const { user } = setup({
          overrideMocks: [citationAssociationsSearch, deleteAssociationResponse]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]

        await user.click(firstCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected citation associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('Citation 2')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking on refresh button', () => {
    test('should call getMetadata() again', async () => {
      const { user } = setup({
        additionalMocks: [citationAssociationsSearch]
      })

      const refreshButton = await screen.findByRole('link', { name: 'refresh the page' })

      await user.click(refreshButton)

      expect(screen.getByText('Citation 2')).toBeInTheDocument()
    })
  })
})
