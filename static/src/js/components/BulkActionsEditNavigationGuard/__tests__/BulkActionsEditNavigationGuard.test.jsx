import React, { useRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub, Link } from 'react-router'

import CollectionSelectionContextProvider from '@/js/providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'
import BulkActionsEditNavigationGuard from '../BulkActionsEditNavigationGuard'

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

const EditPage = () => {
  const skipRef = useRef(false)

  return (
    <>
      <MockSelector />
      <BulkActionsEditNavigationGuard skipRef={skipRef} />
      <Link to="/variables">Go to variables</Link>
      <Link to="/collections">Go to all collections</Link>
      <Link to="/collections/bulk-actions">Bulk Actions</Link>
      <Link to="/variables" onClick={() => { skipRef.current = true }}>
        Cancel (pre-approved exit)
      </Link>
    </>
  )
}

const setup = () => {
  const user = userEvent.setup()

  const Stub = createRoutesStub([
    {
      path: '/:type/bulk-actions/edit',
      Component: EditPage
    },
    {
      path: '/:type/bulk-actions',
      Component: () => <div>Bulk actions landing page</div>
    },
    {
      path: '/collections',
      Component: () => <div>All Collections page</div>
    },
    {
      path: '/variables',
      Component: () => <div>Variables page</div>
    }
  ])

  render(
    <CollectionSelectionContextProvider>
      <Stub initialEntries={['/collections/bulk-actions/edit']} />
    </CollectionSelectionContextProvider>
  )

  return { user }
}

describe('BulkActionsEditNavigationGuard component', () => {
  test('does not block navigation when nothing is selected', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('link', { name: 'Go to variables' }))

    expect(await screen.findByText('Variables page')).toBeInTheDocument()
    expect(screen.queryByText('Leave Bulk Update?')).not.toBeInTheDocument()
  })

  describe('when a collection is selected', () => {
    describe('and the navigation was marked as a pre-approved exit (e.g. the page\'s own Cancel button)', () => {
      test('does not block it', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Cancel (pre-approved exit)' }))

        expect(await screen.findByText('Variables page')).toBeInTheDocument()
        expect(screen.queryByText('Leave Bulk Update?')).not.toBeInTheDocument()
      })
    })

    describe('and the user clicks the Bulk Actions nav item', () => {
      test('does nothing -- no modal, no navigation', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Bulk Actions' }))

        expect(screen.queryByText('Leave Bulk Update?')).not.toBeInTheDocument()
        expect(screen.queryByText('Bulk actions landing page')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Select collection' })).toBeInTheDocument()
      })
    })

    describe('and the user clicks another menu item', () => {
      test('blocks the navigation and shows a confirmation modal', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Go to variables' }))

        expect(await screen.findByText('Leave Bulk Update?')).toBeInTheDocument()
        expect(screen.queryByText('Variables page')).not.toBeInTheDocument()
      })

      test('blocks navigation even to All Collections', async () => {
        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Select collection' }))
        await user.click(screen.getByRole('link', { name: 'Go to all collections' }))

        expect(await screen.findByText('Leave Bulk Update?')).toBeInTheDocument()
        expect(screen.queryByText('All Collections page')).not.toBeInTheDocument()
      })

      describe('when clicking Cancel', () => {
        test('stays on the page', async () => {
          const { user } = setup()

          await user.click(screen.getByRole('button', { name: 'Select collection' }))
          await user.click(screen.getByRole('link', { name: 'Go to variables' }))

          await user.click(await screen.findByRole('button', { name: 'Cancel' }))

          expect(screen.queryByText('Leave Bulk Update?')).not.toBeInTheDocument()
          expect(screen.getByRole('button', { name: 'Select collection' })).toBeInTheDocument()
        })
      })

      describe('when clicking Leave', () => {
        test('proceeds with the navigation', async () => {
          const { user } = setup()

          await user.click(screen.getByRole('button', { name: 'Select collection' }))
          await user.click(screen.getByRole('link', { name: 'Go to variables' }))

          await user.click(await screen.findByRole('button', { name: 'Leave' }))

          expect(await screen.findByText('Variables page')).toBeInTheDocument()
        })
      })
    })
  })
})
