import React, { Suspense } from 'react'
import {
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'

import { collectionRevisions, collectionRevisionsError } from './__mocks__/revisionResults'

import AppContext from '../../../context/AppContext'

import RevisionList from '../RevisionList'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

const setup = (overrideMocks, overrideProps, overrideInitialEntries) => {
  const mocks = [
    collectionRevisions
  ]

  let props = {}

  if (overrideProps) {
    props = {
      ...props,
      ...overrideProps
    }
  }

  const { container } = render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        }
      }
    }
    >
      <MemoryRouter initialEntries={overrideInitialEntries || ['/collections/C1200000104-MMT_2/revisions']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/:type/:conceptId/revisions"
              element={
                (
                  <ErrorBoundary>
                    <Suspense fallback="Loading...">
                      <RevisionList {...props} />
                    </Suspense>
                  </ErrorBoundary>
                )
              }
            />
            <Route
              path="/404"
              element={<div>404 page</div>}
            />
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    </AppContext.Provider>
  )

  return {
    container
  }
}

describe('RevisionList component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
    })

    describe('while the request is loading', () => {
      test('renders the placeholders', async () => {
        expect(screen.queryByText('Loading...'))
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(9)
        })

        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row2 = rows[2]

        const row1Cells = within(row1).queryAllByRole('cell')
        const row2Cells = within(row2).queryAllByRole('cell')
        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('8 - Published')
        expect(row1Cells[1].textContent).toBe('2024-04-24')
        expect(row1Cells[2].textContent).toBe('admin')
        expect(row1Cells[3].textContent).toBe('')

        expect(row2Cells).toHaveLength(4)
        expect(row2Cells[0].textContent).toBe('7 - Revision')
        expect(row2Cells[1].textContent).toBe('2024-04-24')
        expect(row2Cells[2].textContent).toBe('admin')
        // Change after GQL-32
        expect(row2Cells[3].textContent).toBe('Revert to this revision')
      })
    })
  })
})
