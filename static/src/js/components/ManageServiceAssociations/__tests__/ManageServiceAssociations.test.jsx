import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import errorLogger from '@/js/utils/errorLogger'
import NotificationsContext from '@/js/context/NotificationsContext'

import {
  deleteAssociationsError,
  deleteAssociationResponse,
  serviceAssociationsSearch
} from './__mocks__/serviceAssociationsResponses'

import ManageServiceAssociations from '../ManageServiceAssociations'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overrideMocks = false,
  overridePaths
}) => {
  const mocks = [
    serviceAssociationsSearch,
    ...additionalMocks
  ]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MemoryRouter initialEntries={overrideInitialEntries || ['/collections/C00000001-TESTPROV/service-associations']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path={overridePaths || 'collections/:conceptId/service-associations'}
              element={
                (
                  <ErrorBoundary>
                    <Suspense>
                      <ManageServiceAssociations />
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

describe('ManageServiceAssociation', () => {
  describe('when the service association page is requested', () => {
    test('renders the service association page with the associated services', async () => {
      setup({})

      expect(await screen.findByText('Showing 2 service associations')).toBeInTheDocument()
      expect(screen.getByText('UARS Read Software')).toBeInTheDocument()
      expect(screen.getByText('UARS Write Software')).toBeInTheDocument()
    })
  })

  describe('when a service association has an order option', () => {
    test('renders a button that navigates to order option', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})

      const rows = await screen.findAllByRole('row')
      const orderOptionRow = rows[1]
      expect(orderOptionRow).toHaveTextContent('UARS Read SoftwareOrder Option')

      const orderOptionButton = within(orderOptionRow).getByRole('button', { name: 'Order Option' })
      await user.click(orderOptionButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO10000-TESTPROV')
    })
  })

  describe('when a service association has no order option', () => {
    test('renders nothing to order option cell', async () => {
      setup({})

      const rows = await screen.findAllByRole('row')
      const noOrderOptionRow = rows[2]

      expect(noOrderOptionRow).toHaveTextContent('UARS Write Software')
    })
  })

  describe('when disassociating an associated service', () => {
    describe('when selecting and clicking on Delete Selected Service', () => {
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

        expect(screen.getByText('Are you sure you want to delete the selected service associations?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(await screen.findByText('Showing 2 service associations')).toBeInTheDocument()
        expect(screen.getByText('UARS Read Software')).toBeInTheDocument()
        expect(screen.getByText('UARS Write Software')).toBeInTheDocument()
      })
    })

    describe('when selecting Yes in the modal and results in an error ', () => {
      test('should call errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [serviceAssociationsSearch, deleteAssociationsError]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]
        const secondCheckbox = checkboxes[1]

        await user.click(secondCheckbox)
        await user.click(firstCheckbox)
        await user.click(secondCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected service associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledWith('Unable to disassociate service record for C00000001-TESTPROV', 'Manage Service Association: deleteAssociation Mutation')
        })

        expect(errorLogger).toHaveBeenCalledTimes(1)
      })
    })

    describe('when selecting Yes in the modal and results in a success ', () => {
      test('should remove the deleted service', async () => {
        const { user } = setup({
          overrideMocks: [serviceAssociationsSearch, deleteAssociationResponse]
        })

        const checkboxes = await screen.findAllByRole('checkbox')
        const firstCheckbox = checkboxes[0]

        await user.click(firstCheckbox)

        const deleteSelectedAssociationButton = screen.getByRole('button', { name: 'Delete Selected Associations' })

        await user.click(deleteSelectedAssociationButton)

        expect(screen.getByText('Are you sure you want to delete the selected service associations?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('UARS Write Software')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking on refresh button', () => {
    test('should call getMetadata() again', async () => {
      const { user } = setup({
        additionalMocks: [serviceAssociationsSearch]
      })

      const refreshButton = await screen.findByRole('link', { name: 'refresh the page' })

      await user.click(refreshButton)

      expect(screen.getByText('UARS Write Software')).toBeInTheDocument()
    })
  })
})
