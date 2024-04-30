import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import AppContext from '../../../context/AppContext'
import ManageCollectionAssociationPage from '../ManageCollectionAssociationPage'
import { collectionResult } from './__mocks__/collectionResult'

vi.mock('../../../components/ManageCollectionAssociation/ManageCollectionAssociation')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ conceptId: 'C-00000001-TESTPROV' }))
}))

const setup = () => {
  const mocks = [
    collectionResult
  ]

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MockedProvider
        mocks={mocks}
      >
        <MemoryRouter initialEntries={
          [{
            pathname: '/collections/C-00000001-TESTPROV/collection-association'
          }]
        }
        >
          <Routes>
            <Route path="/:type/:conceptId/collection-association" element={<ManageCollectionAssociationPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>

    </AppContext.Provider>
  )
}

describe('ManageCollectionAssociationPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      await waitForResponse()

      expect(screen.getByRole('link', { name: 'Collection Drafts' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collection Drafts' })).toHaveAttribute('href', '/drafts/collections')
      expect(screen.getByRole('link', { name: 'Collection Title 1' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Collection Title 1' })).toHaveAttribute('href', '/collections/C-00000001-TESTPROV')
      expect(screen.getAllByRole('listitem').at(2)).toBeInTheDocument()
      expect(screen.getAllByRole('listitem').at(2)).toHaveTextContent('Collection Associations')
      expect(screen.getByRole('heading', { name: 'Collection Associations' })).toBeInTheDocument()
    })
  })
})
