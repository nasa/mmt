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

let mockDraftType
const setMockDraftType = (draftType) => {
  mockDraftType = draftType
}

vi.mock('../../../components/DraftList/DraftList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: mockDraftType }))
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

const setup = (draftType) => {
  setMockDraftType(draftType)
  render(
    <MemoryRouter initialEntries={
      [{
        pathname: `/drafts/${draftType}`
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
  describe('when showing the header for tools', () => {
    test('should render the correct header', async () => {
      setup('tools')

      expect(await screen.findByRole('heading', { name: 'Tool Drafts' })).toBeInTheDocument()

      expect(screen.getByText('New Draft')).toBeInTheDocument()
      expect(screen.getByLabelText('A plus icon')).toBeInTheDocument()
      expect(screen.queryByText('Upload Draft')).not.toBeInTheDocument()
      expect(within(screen.getByRole('navigation', { name: 'breadcrumb' })).getByText('Tool Drafts')).toBeInTheDocument()
    })
  })

  describe('when showing the header for collections', () => {
    test('should render the correct header', async () => {
      setup('collections')

      expect(await screen.findByRole('heading', { name: 'Collection Drafts' })).toBeInTheDocument()

      expect(screen.getByText('New Draft')).toBeInTheDocument()
      expect(screen.getByLabelText('A plus icon')).toBeInTheDocument()
      expect(screen.getByText('Upload Draft')).toBeInTheDocument()
      expect(within(screen.getByRole('navigation', { name: 'breadcrumb' })).getByText('Collection Drafts')).toBeInTheDocument()
    })
  })
})
