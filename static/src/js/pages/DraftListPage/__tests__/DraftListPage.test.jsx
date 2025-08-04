import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import {
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import errorLogger from '@/js/utils/errorLogger'
import DraftListPage from '../DraftListPage'

vi.mock('@/js/utils/errorLogger')

const mockIngestDraftMutation = vi.fn()

const mockAddNotification = vi.fn()
vi.mock('@/js/hooks/useNotificationsContext', () => ({
  default: vi.fn(() => ({
    addNotification: mockAddNotification
  }))
}))

vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(() => [mockIngestDraftMutation, {
    loading: false,
    error: null
  }]),
  gql: vi.fn((args) => args)
}))

let mockDraftType
const setMockDraftType = (draftType) => {
  mockDraftType = draftType
}

vi.mock('@/js/components/DraftList/DraftList')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: mockDraftType }))
}))

vi.mock('@/js/hooks/useAppContext', () => ({
  default: vi.fn(() => ({
    providerId: 'MOCK_PROVIDER_ID'
  }))
}))

vi.mock('@/js/hooks/useAvailableProviders', () => ({
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

vi.mock('@/js/hooks/useNotificationsContext', () => ({
  default: vi.fn(() => ({
    addNotification: mockAddNotification
  }))
}))

vi.mock('@/js/components/JsonFileUploadModal/JsonFileUploadModal', () => ({
  JsonFileUploadModal: vi.fn(({ upload }) => (
    <button type="button" onClick={() => upload({ test: 'data' })}>Mock Upload</button>
  ))
}))

vi.mock('@/js/components/ChooseProviderModal/ChooseProviderModal', () => ({
  default: vi.fn(({ onSubmit, toggleModal }) => (
    <button
      type="button"
      onClick={
        () => {
          onSubmit()
          toggleModal()
        }
      }
    >
      Mock Submit
    </button>
  ))
}))

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

  describe('when upload a collection', () => {
    test('should handle draft upload correctly', async () => {
      setup('collections')

      // Find the "Upload Draft" button more specifically
      const uploadButton = screen.getByRole('button', { name: /upload draft/i })
      await userEvent.click(uploadButton)

      // Simulate file upload
      const mockUploadButton = screen.getByRole('button', { name: /mock upload/i })
      await userEvent.click(mockUploadButton)

      // Click the submit button in the ChooseProviderModal
      const mockSubmitButton = screen.getByRole('button', { name: /mock submit/i })
      await userEvent.click(mockSubmitButton)

      // Wait for the mutation to be called
      await waitFor(() => {
        expect(mockIngestDraftMutation).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              conceptType: 'Collection',
              metadata: { test: 'data' },
              providerId: 'MOCK_PROVIDER_ID'
            }),
            onCompleted: expect.any(Function),
            onError: expect.any(Function)
          })
        )
      })

      // Simulate the onCompleted callback
      const onCompletedCallback = mockIngestDraftMutation.mock.calls[0][0].onCompleted
      act(() => {
        onCompletedCallback({ ingestDraft: { conceptId: 'MOCK_CONCEPT_ID' } })
      })

      // Check if notification was added
      await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith({
          message: 'Draft uploaded successfully',
          variant: 'success'
        })
      })
    })
  })

  describe('when upload a collection fails', () => {
    test('should handle draft upload error correctly', async () => {
      // Mock the mutation to simulate an error
      const mockError = new Error('Upload failed')
      mockIngestDraftMutation.mockImplementation((options) => {
        options.onError(mockError)
      })

      setup('collections')

      // Find the "Upload Draft" button more specifically
      const uploadButton = screen.getByRole('button', { name: /upload draft/i })
      await userEvent.click(uploadButton)

      // Simulate file upload
      const mockUploadButton = screen.getByRole('button', { name: /mock upload/i })
      await userEvent.click(mockUploadButton)

      // Click the submit button in the ChooseProviderModal
      const mockSubmitButton = screen.getByRole('button', { name: /mock submit/i })
      await userEvent.click(mockSubmitButton)

      // Wait for the mutation to be called
      await waitFor(() => {
        expect(mockIngestDraftMutation).toHaveBeenCalled()
      })

      // Check if error notification was added
      await waitFor(() => {
        expect(mockAddNotification).toHaveBeenCalledWith({
          message: 'Error uploading draft',
          variant: 'danger'
        })
      })

      // Check if errorLogger was called
      expect(errorLogger).toHaveBeenCalledWith(mockError, 'MetadataForm: ingestDraftMutation')
    })
  })
})
