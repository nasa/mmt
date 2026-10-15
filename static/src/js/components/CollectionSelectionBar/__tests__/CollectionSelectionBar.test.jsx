import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Link,
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import CollectionSelectionBar from '../CollectionSelectionBar'
import CollectionSelectionContextProvider from '../../../providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import NotificationsContextProvider from '../../../providers/NotificationsContextProvider/NotificationsContextProvider'
import Notifications from '../../Notifications/Notifications'
import useCollectionSelectionContext from '../../../hooks/useCollectionSelectionContext'

const MockSelector = () => {
  const { toggleCollectionSelection } = useCollectionSelectionContext()

  return (
    <button
      type="button"
      onClick={() => toggleCollectionSelection('C1-TESTPROV', 'TESTPROV')}
    >
      Select collection
    </button>
  )
}

const setup = () => {
  const user = userEvent.setup()

  // Mirrors production: CollectionSelectionBar and Notifications are rendered once at the
  // layout/app level, outside the routed page content, so they stay mounted across navigation.
  render(
    <MemoryRouter initialEntries={['/collections']}>
      <NotificationsContextProvider>
        <CollectionSelectionContextProvider>
          <MockSelector />
          <Link to="/variables">Go to variables</Link>
          <CollectionSelectionBar />
          <Notifications />
          <Routes>
            <Route
              path="/collections"
              element={<div>Collections page</div>}
            />
            <Route
              path="/collections/bulk-actions/configure"
              element={<div>Bulk actions configure page</div>}
            />
            <Route
              path="/variables"
              element={<div>Variables page</div>}
            />
          </Routes>
        </CollectionSelectionContextProvider>
      </NotificationsContextProvider>
    </MemoryRouter>
  )

  return { user }
}

describe('CollectionSelectionBar component', () => {
  test('renders nothing when no collections are selected', () => {
    setup()

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument()
  })

  describe('when a collection is selected', () => {
    test('shows the selection count, provider, and action buttons', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))

      expect(screen.getByText(/1 collection selected from TESTPROV/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    })

    describe('when clicking Clear', () => {
      test('clears the selection and hides the bar', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('button', { name: 'Clear' }))

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument()
      })

      test('shows a toast with an Undo action', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('button', { name: 'Clear' }))

        expect(screen.getByText('Selection cleared')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
      })

      describe('when clicking Undo on the toast', () => {
        test('restores the previous selection', async () => {
          const { user } = setup()

          await user.click(screen.getByRole('button', { name: 'Select collection' }))
          await user.click(screen.getByRole('button', { name: 'Clear' }))
          await user.click(screen.getByRole('button', { name: 'Undo' }))

          expect(screen.getByText(/1 collection selected from TESTPROV/)).toBeInTheDocument()
          expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
          expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument()
        })
      })

      describe('when navigating away', () => {
        test('keeps the Undo toast visible', async () => {
          const { user } = setup()

          await user.click(screen.getByRole('button', { name: 'Select collection' }))
          await user.click(screen.getByRole('button', { name: 'Clear' }))

          expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()

          await user.click(screen.getByRole('link', { name: 'Go to variables' }))

          expect(await screen.findByText('Variables page')).toBeInTheDocument()
          expect(screen.getByText('Selection cleared')).toBeInTheDocument()
          expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
        })
      })
    })

    describe('when clicking Continue', () => {
      test('navigates to the bulk actions configure page', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('button', { name: 'Continue' }))

        expect(screen.getByText('Bulk actions configure page')).toBeInTheDocument()
      })
    })
  })
})
