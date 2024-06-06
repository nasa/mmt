import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import ManageCollectionAssociationPage from '../ManageCollectionAssociationPage'
import { collectionResult } from './__mocks__/collectionResult'

vi.mock('../../../components/ManageCollectionAssociation/ManageCollectionAssociation')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ conceptId: 'C00000001-TESTPROV' }))
}))

const setup = () => {
  const mocks = [
    collectionResult
  ]

  render(
    <MockedProvider
      mocks={mocks}
    >
      <MemoryRouter initialEntries={
        [{
          pathname: '/collections/C00000001-TESTPROV/collection-association'
        }]
      }
      >
        <Routes>
          <Route path="/:type/:conceptId/collection-association" element={<ManageCollectionAssociationPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('ManageCollectionAssociationPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      expect(await screen.findByRole('heading', { name: 'Collection Title 1 Collection Associations' })).toBeInTheDocument()

      expect(screen.getByRole('link', { name: 'Collections' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collections' })).toHaveAttribute('href', '/collections')
      expect(screen.getByRole('link', { name: 'Collection Title 1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collection Title 1' })).toHaveAttribute('href', '/collections/C00000001-TESTPROV')
      expect(screen.getAllByRole('listitem').at(2)).toBeInTheDocument()
      expect(screen.getAllByRole('listitem').at(2)).toHaveTextContent('Collection Associations')
    })
  })
})
