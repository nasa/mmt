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

import DraftListPage from '../DraftListPage'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary'

vi.mock('../../../components/DraftList/DraftList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: 'Tool' }))
}))

vi.mock('../../../hooks/useAppContext', () => ({
  default: vi.fn(() => ({
    providerId: 'MOCK_PROVIDER_ID'
  }))
}))

vi.mock('../../../hooks/useAvailableProviders', () => ({
  default: vi.fn(() => ({
    availableProviders: [
      {
        id: 'MOCK_PROVIDER_1',
        name: 'Mock Provider 1'
      },
      {
        id: 'MOCK_PROVIDER_2',
        name: 'Mock Provider 2'
      }
    ],
    loading: false,
    error: null
  }))
}))

vi.mock('../../../hooks/useNotificationsContext', () => ({
  default: vi.fn(() => ({
    addNotification: vi.fn()
  }))
}))

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useMutation: vi.fn(() => [vi.fn(), {
      loading: false,
      error: null
    }]),
    gql: vi.fn((args) => args)
  }
})

const setup = () => {
  render(
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
  )
}

describe('DraftListPage', () => {
  describe('when showing the header', () => {
    test('render the header', async () => {
      setup()

      expect(await screen.findByRole('heading', { name: 'Tool Drafts' })).toBeInTheDocument()

      expect(screen.getByText('New Draft')).toBeInTheDocument()
      expect(screen.getByLabelText('A plus icon')).toBeInTheDocument()
      expect(within(screen.getByRole('navigation', { name: 'breadcrumb' })).getByText('Tool Drafts')).toBeInTheDocument()
    })
  })
})
