import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import AppContext from '../../../context/AppContext'
import DraftListPage from '../DraftListPage'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary'

vi.mock('../../../components/DraftList/DraftList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: 'Tool' }))
}))

const setup = () => {
  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MemoryRouter initialEntries={
        [{
          pathname: '/drafts/tools'
        }]
      }
      >
        <Routes>
          <Route
            path="/drafts/:draftType/*"
            element={
              (
                <ErrorBoundary>
                  <Suspense>
                    <DraftListPage />
                  </Suspense>
                </ErrorBoundary>
              )
            }

          />
        </Routes>
      </MemoryRouter>
    </AppContext.Provider>
  )
}

describe('DraftListPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      await waitForResponse()

      expect(screen.getByText('New Draft')).toBeInTheDocument()
      expect(screen.getByText('A plus icon')).toBeInTheDocument()
      expect(within(screen.getByRole('navigation', { name: 'breadcrumb' })).getByText('Tool Drafts')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Tool Drafts' })).toBeInTheDocument()
    })
  })
})
