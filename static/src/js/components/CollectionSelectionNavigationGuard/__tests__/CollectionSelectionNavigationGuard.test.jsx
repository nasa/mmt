import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub, Link } from 'react-router'

import CollectionSelectionNavigationGuard from '../CollectionSelectionNavigationGuard'
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

const CollectionsPage = () => (
  <>
    <MockSelector />
    <CollectionSelectionNavigationGuard />
    <Link to="/variables">Go to variables</Link>
    <Link to="/collections/bulk-actions/configure">Continue to bulk actions</Link>
  </>
)

const setup = () => {
  const user = userEvent.setup()

  const Stub = createRoutesStub([
    {
      path: '/collections',
      Component: CollectionsPage
    },
    {
      path: '/collections/bulk-actions/configure',
      Component: () => <div>Bulk actions configure page</div>
    },
    {
      path: '/variables',
      Component: () => <div>Variables page</div>
    }
  ])

  render(
    <CollectionSelectionContextProvider>
      <Stub initialEntries={['/collections']} />
    </CollectionSelectionContextProvider>
  )

  return { user }
}

describe('CollectionSelectionNavigationGuard component', () => {
  test('does not block navigation away from collections when nothing is selected', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('link', { name: 'Go to variables' }))

    expect(await screen.findByText('Variables page')).toBeInTheDocument()
    expect(screen.queryByText('Leave Collections?')).not.toBeInTheDocument()
  })

  test('does not block navigation to another collections sub-route', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Select collection' }))
    await user.click(screen.getByRole('link', { name: 'Continue to bulk actions' }))

    expect(await screen.findByText('Bulk actions configure page')).toBeInTheDocument()
    expect(screen.queryByText('Leave Collections?')).not.toBeInTheDocument()
  })

  describe('when a collection is selected and the user navigates away from collections', () => {
    test('blocks the navigation and shows a confirmation modal', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.click(screen.getByRole('link', { name: 'Go to variables' }))

      expect(await screen.findByText('Leave Collections?')).toBeInTheDocument()
      expect(screen.queryByText('Variables page')).not.toBeInTheDocument()
    })

    describe('when clicking Cancel', () => {
      test('stays on the page and keeps the selection', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Go to variables' }))

        await user.click(await screen.findByRole('button', { name: 'Cancel' }))

        expect(screen.queryByText('Leave Collections?')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Select collection' })).toBeInTheDocument()
      })
    })

    describe('when dismissing the modal via the close button', () => {
      test('stays on the page and keeps the selection', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Go to variables' }))

        await user.click(await screen.findByRole('button', { name: /Close/i }))

        expect(screen.queryByText('Leave Collections?')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Select collection' })).toBeInTheDocument()
      })
    })

    describe('when clicking Leave', () => {
      test('proceeds with the navigation and clears the selection', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Go to variables' }))

        await user.click(await screen.findByRole('button', { name: 'Leave' }))

        expect(await screen.findByText('Variables page')).toBeInTheDocument()
      })
    })
  })
})
