import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import GranulesListPage from '../GranulesListPage'
import granuleResults from './__mocks__/granuleResults'

vi.mock('../../../components/GranulesList/GranulesList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ conceptId: 'C1200000104-MMT_2' }))
}))

const setup = () => {
  const mocks = [
    granuleResults
  ]

  render(
    <MockedProvider
      mocks={mocks}
    >
      <MemoryRouter initialEntries={
        [{
          pathname: '/collections/C1200000104-MMT_2/granules'
        }]
      }
      >
        <Routes>
          <Route path="/collections/:conceptId/granules" element={<GranulesListPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('GranulesListPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      expect(await screen.findByText('Collections')).toBeInTheDocument()
      expect(screen.getByText('C1200000104-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('10099-2 Granules')).toBeInTheDocument()
    })
  })
})
