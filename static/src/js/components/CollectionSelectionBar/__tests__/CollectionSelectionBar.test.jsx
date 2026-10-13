import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import CollectionSelectionBar from '../CollectionSelectionBar'
import CollectionSelectionContextProvider from '../../../providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
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

  render(
    <MemoryRouter initialEntries={['/collections']}>
      <CollectionSelectionContextProvider>
        <Routes>
          <Route
            path="/collections"
            element={
              (
                <>
                  <MockSelector />
                  <CollectionSelectionBar />
                </>
              )
            }
          />
          <Route
            path="/collections/bulk-actions/configure"
            element={<div>Bulk actions configure page</div>}
          />
        </Routes>
      </CollectionSelectionContextProvider>
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
