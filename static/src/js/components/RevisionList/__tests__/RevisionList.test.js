import React from 'react'
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
import userEvent from '@testing-library/user-event'

import {
  singlePageCollectionRevisions,
  multiPageCollectionRevisionsPage1,
  multiPageCollectionRevisionsPage2,
  singlePageCollectionRevisionsError,
  singlePageVariableRevisions,
  singlePageVariableRevisionsError
} from './__mocks__/revisionResults'

import RevisionList from '../RevisionList'
import AppContext from '../../../context/AppContext'

const setup = (overrideMocks, overrideProps, overrideInitialEntries) => {
  const mocks = [
    singlePageVariableRevisions
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
      <MemoryRouter initialEntries={overrideInitialEntries || ['/variables/V1004-MMT_2/revisions?versions=2']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/:type/:conceptId/revisions"
              element={<RevisionList {...props} />}
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
        expect(screen.queryAllByRole('cell', {
          busy: true,
          hidden: true
        })).toHaveLength(80)
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })

        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row2 = rows[2]

        const row1Cells = within(row1).queryAllByRole('cell')
        const row2Cells = within(row2).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('2 - Published View')
        expect(row1Cells[1].textContent).toBe('2023-12-30')
        expect(row1Cells[2].textContent).toBe('admin')
        // Change after GQL-32
        expect(row1Cells[3].textContent).toBe('Revert to this version')

        expect(row2Cells).toHaveLength(4)
        expect(row2Cells[0].textContent).toBe('1 - Revision View')
        expect(row2Cells[1].textContent).toBe('2023-11-30')
        expect(row2Cells[2].textContent).toBe('admin')
        // // Change after GQL-32
        expect(row2Cells[3].textContent).toBe('Revert to this version')
      })
    })

    describe('with multiple pages of results', () => {
      test('shows the pagination', async () => {
        setup([multiPageCollectionRevisionsPage1, multiPageCollectionRevisionsPage2], { limit: 3 })

        await waitFor(() => {
          expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
        })

        const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })

        expect(pagination).toHaveLength(2)

        expect(within(pagination[0]).getAllByRole('button')).toHaveLength(3)

        expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')
        expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 3' })).toHaveTextContent('3')
        expect(within(pagination[0]).getByRole('button', { name: 'Goto Next Page' })).toHaveTextContent('›Next')

        expect(within(pagination[1]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')
        expect(within(pagination[1]).getByRole('button', { name: 'Goto Page 3' })).toHaveTextContent('3')
        expect(within(pagination[1]).getByRole('button', { name: 'Goto Next Page' })).toHaveTextContent('›Next')
      })
    })
  })
})
