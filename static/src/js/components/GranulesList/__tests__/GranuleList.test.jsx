import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'

import granuleResults from '@/js/components/GranulesList/__tests__/__mocks__/granuleResults'
import GranulesList from '../GranulesList'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

const setup = ({
  overrideInitialEntries,
  overrideMocks
}) => {
  const mocks = [granuleResults]

  render(
    <MemoryRouter initialEntries={overrideInitialEntries || ['/collections/C1200000104-MMT_2/granules']}>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <Routes>
          <Route
            path="/:type/:conceptId/granules"
            element={
              (
                <ErrorBoundary>
                  <Suspense fallback="Loading...">
                    <GranulesList />
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
  )
}

describe('GranulesList component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup({})
    })

    test('should render the granules', async () => {
      expect(screen.queryByText('Loading...'))

      const tableRows = await screen.findAllByRole('row')
      expect(tableRows.length).toEqual(3) // 2 granules + 1 header row

      const date = new Date(2000, 1, 1, 13)
      vi.setSystemTime(date)
      const rows = screen.queryAllByRole('row')
      const row1 = rows[1]
      const row2 = rows[2]

      const row1Cells = within(row1).queryAllByRole('cell')
      const row2Cells = within(row2).queryAllByRole('cell')
      expect(row1Cells).toHaveLength(3)
      expect(row1Cells[0].textContent).toBe('G1200484638-CMR_ONLY')
      expect(row1Cells[1].textContent).toBe('jteague_granule2321')
      expect(row1Cells[2].textContent).toBe('Tuesday, April 29, 2025 6:20 PM')

      expect(row2Cells).toHaveLength(3)
      expect(row2Cells[0].textContent).toBe('G1200484635-CMR_ONLY')
      expect(row2Cells[1].textContent).toBe('jteague_granule2')
      expect(row2Cells[2].textContent).toBe('Tuesday, April 29, 2025 6:18 PM')
    })
  })

  describe('when there is an error', () => {
    test('should display an error message', async () => {
      setup({
        overrideMocks: [{
          request: granuleResults.request,
          error: new Error('An error occurred')
        }]
      })

      await screen.findByText('An error occurred')
    })
  })
})
