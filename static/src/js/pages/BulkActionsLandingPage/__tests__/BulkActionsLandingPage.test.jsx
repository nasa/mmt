import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import CollectionSelectionContextProvider from '@/js/providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

import BulkActionsLandingPage from '../BulkActionsLandingPage'

// Pre-selects collections by rendering a button that calls the real context's
// toggleCollectionSelection, mirroring the pattern used by CollectionSelectionBar's tests.
const PreSelectCollections = () => {
  const { toggleCollectionSelection } = useCollectionSelectionContext()

  return (
    <button
      type="button"
      onClick={
        () => {
          toggleCollectionSelection('C1-TESTPROV', 'TESTPROV')
          toggleCollectionSelection('C2-TESTPROV', 'TESTPROV')
        }
      }
    >
      Select collections
    </button>
  )
}

const setup = () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={['/collections/bulk-actions']}>
      <CollectionSelectionContextProvider>
        <PreSelectCollections />
        <Routes>
          <Route path="/:type/bulk-actions" element={<BulkActionsLandingPage />} />
          <Route path="/:type/bulk-actions/edit" element={<div>Bulk actions edit page</div>} />
        </Routes>
      </CollectionSelectionContextProvider>
    </MemoryRouter>
  )

  return { user }
}

describe('BulkActionsLandingPage component', () => {
  test('renders a Bulk Actions heading', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Bulk Actions' })).toBeInTheDocument()
  })

  describe('when no collections are selected', () => {
    test('links back to All Collections', () => {
      setup()

      expect(screen.getByText(/To start a bulk action/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'All Collections' })).toHaveAttribute('href', '/collections')
    })
  })

  describe('when collections are already selected', () => {
    test('shows the selection and a way to continue to the edit page', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collections' }))

      expect(screen.getByText('2 collections selected from TESTPROV.')).toBeInTheDocument()
      expect(screen.queryByText(/To start a bulk action/)).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Continue to Configure Bulk Update' }))

      expect(await screen.findByText('Bulk actions edit page')).toBeInTheDocument()
    })
  })
})
