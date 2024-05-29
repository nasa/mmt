import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import RevisionListPage from '../RevisionListPage'
import { singlePageCollectionSearch } from './__mocks__/searchResults'

vi.mock('../../../components/RevisionList/RevisionList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ conceptId: 'C00000001-TESTPROV' }))
}))

const setup = () => {
  const mocks = [
    singlePageCollectionSearch
  ]

  render(
    <MockedProvider
      mocks={mocks}
    >
      <MemoryRouter initialEntries={
        [{
          pathname: '/collections/C00000001-TESTPROV/revisions'
        }]
      }
      >
        <Routes>
          <Route path="/:type/:conceptId/revisions" element={<RevisionListPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('RevisionListPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      await waitForResponse()
      expect(screen.getByText('Collections')).toBeInTheDocument()
      expect(screen.getByText('Collection Title 1')).toBeInTheDocument()
      expect(screen.getByText('2 Collection Revisions')).toBeInTheDocument()
    })
  })
})
