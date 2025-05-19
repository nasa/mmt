import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'
import getUmmVersion from '@/js/utils/getUmmVersion'
import useIngestDraftMutation from '../useIngestDraftMutation'

vi.mock('../utils/getHumanizedNameFromTypeParam', () => ({
  default: () => 'humanizedName'
}))

// eslint-disable-next-line react/prop-types
const TestComponent = ({ conceptType, customNativeId }) => {
  const {
    ingestMutation, ingestDraft, error, loading
  } = useIngestDraftMutation()

  const handleIngest = () => {
    ingestMutation(
      conceptType,
      '{"some": "metadata"}',
      customNativeId || 'test-native-id',
      'TEST_PROVIDER'
    )
  }

  return (
    <div>
      <button type="button" onClick={handleIngest}>
        Ingest
        {' '}
        {conceptType}
      </button>
      {loading && <span>Loading</span>}
      {
        error && (
          <span>
            Error:
            {' '}
            {error.message}
          </span>
        )
      }
      {
        ingestDraft && (
          <span>
            Ingested:
            {' '}
            {JSON.stringify(ingestDraft)}
          </span>
        )
      }
    </div>
  )
}

const setup = (overrideMocks = [], initialEntries = ['/']) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={overrideMocks}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<TestComponent conceptType="Tool" />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )

  return { user }
}

describe('useIngestDraftMutation', () => {
  describe('when ingesting a concept', () => {
    test('calls ingestDraftMutation with the correct variables', async () => {
      const mocks = [{
        request: {
          query: INGEST_DRAFT,
          variables: {
            conceptType: 'Tool',
            metadata: '{"some": "metadata"}',
            nativeId: 'test-native-id',
            providerId: 'TEST_PROVIDER',
            ummVersion: getUmmVersion('Tool')
          }
        },
        result: {
          data: {
            ingestDraft: {
              conceptId: 'TD1000000-MMT',
              revisionId: '1'
            }
          }
        }
      }]

      const { user } = setup(mocks)

      const ingestButton = screen.getByText('Ingest Tool')
      await user.click(ingestButton)

      await waitFor(() => {
        expect(screen.getByText(/Ingested:/)).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })
  })

  describe('when ingesting a Visualization concept', () => {
    test('adds "-draft" to the nativeId if not present', async () => {
      const mocks = [{
        request: {
          query: INGEST_DRAFT,
          variables: {
            conceptType: 'Visualization',
            metadata: '{"some": "metadata"}',
            nativeId: 'test-native-id-draft',
            providerId: 'TEST_PROVIDER',
            ummVersion: getUmmVersion('Visualization')
          }
        },
        result: {
          data: {
            ingestDraft: {
              conceptId: 'VISD1000000-MMT',
              revisionId: '1'
            }
          }
        }
      }]

      const customSetup = (customMocks, initialEntries) => {
        const user = userEvent.setup()
        render(
          <MockedProvider mocks={customMocks}>
            <MemoryRouter initialEntries={initialEntries}>
              <Routes>
                <Route
                  path="/"
                  element={
                    (
                      <TestComponent
                        conceptType="Visualization"
                        customNativeId="test-native-id"
                      />
                    )
                  }
                />
              </Routes>
            </MemoryRouter>
          </MockedProvider>
        )

        return { user }
      }

      const { user } = customSetup(mocks, ['/'])

      const ingestButton = screen.getByText('Ingest Visualization')
      await user.click(ingestButton)

      await waitFor(() => {
        expect(screen.getByText(/Ingested:/)).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })

    test('does not modify nativeId for Visualization concepts when -draft is already present', async () => {
      const mocks = [{
        request: {
          query: INGEST_DRAFT,
          variables: {
            conceptType: 'Visualization',
            metadata: '{"some": "metadata"}',
            nativeId: 'test-native-id-draft',
            providerId: 'TEST_PROVIDER',
            ummVersion: getUmmVersion('Visualization')
          }
        },
        result: {
          data: {
            ingestDraft: {
              conceptId: 'VISD1000000-MMT',
              revisionId: '1'
            }
          }
        }
      }]

      const customSetup = (customMocks, initialEntries) => {
        const user = userEvent.setup()
        render(
          <MockedProvider mocks={customMocks}>
            <MemoryRouter initialEntries={initialEntries}>
              <Routes>
                <Route
                  path="/"
                  element={
                    (
                      <TestComponent
                        conceptType="Visualization"
                        customNativeId="test-native-id-draft"
                      />
                    )
                  }
                />
              </Routes>
            </MemoryRouter>
          </MockedProvider>
        )

        return { user }
      }

      const { user } = customSetup(mocks, ['/'])

      const ingestButton = screen.getByText('Ingest Visualization')
      await user.click(ingestButton)

      await waitFor(() => {
        expect(screen.getByText(/Ingested:/)).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })
  })

  describe('when the ingestDraftMutation encounters an error', () => {
    test('sets the error state', async () => {
      const mocks = [{
        request: {
          query: INGEST_DRAFT,
          variables: {
            conceptType: 'Tool',
            metadata: '{"some": "metadata"}',
            nativeId: 'test-native-id',
            providerId: 'TEST_PROVIDER',
            ummVersion: getUmmVersion('Tool')
          }
        },
        error: new Error('An error occurred')
      }]

      const { user } = setup(mocks)

      const ingestButton = screen.getByText('Ingest Tool')
      await user.click(ingestButton)

      await waitFor(() => {
        expect(screen.getByText('Error: An error occurred')).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Ingested:/)).not.toBeInTheDocument()
    })
  })
})
