import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_CITATION_ASSOCIATIONS } from '@/js/operations/queries/getCitationAssociations'

import ManageCitationAssociationsPage from '../ManageCitationAssociationsPage'

vi.mock('../../../components/ManageCitationAssociations/ManageCitationAssociations')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ conceptId: 'C00000001-TESTPROV' }))
}))

const setup = () => {
  const mocks = [
    {
      request: {
        query: GET_CITATION_ASSOCIATIONS,
        variables: {
          params: {
            conceptId: 'C00000001-TESTPROV'
          }
        }
      },
      result: {
        data: {
          collection: {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            citations: {}
          }
        }
      }
    }
  ]

  render(
    <MockedProvider
      mocks={mocks}
    >
      <MemoryRouter initialEntries={
        [{
          pathname: '/collections/C00000001-TESTPROV/citation-associations'
        }]
      }
      >
        <Routes>
          <Route path="/:type/:conceptId/citation-associations" element={<ManageCitationAssociationsPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('ManageCitationAssociationsPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      expect(await screen.findByRole('heading', { name: 'Collection Short Name 1 Citation Associations' })).toBeInTheDocument()

      expect(screen.getByRole('link', { name: 'Collections' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collections' })).toHaveAttribute('href', '/collections')
      expect(screen.getByRole('link', { name: 'Collection Short Name 1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collection Short Name 1' })).toHaveAttribute('href', '/collections/C00000001-TESTPROV')
      expect(screen.getAllByRole('listitem').at(2)).toBeInTheDocument()
      expect(screen.getAllByRole('listitem').at(2)).toHaveTextContent('Citation Associations')
    })
  })
})
