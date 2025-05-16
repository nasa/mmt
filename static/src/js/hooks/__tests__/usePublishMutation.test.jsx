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

import { PUBLISH_DRAFT } from '@/js/operations/mutations/publishDraft'
import getUmmVersion from '@/js/utils/getUmmVersion'

import usePublishMutation from '../usePublishMutation'

vi.mock('../utils/getHumanizedNameFromTypeParam', () => ({
  default: () => 'humanizedName'
}))

// eslint-disable-next-line react/prop-types
const TestComponent = ({ queryName, customNativeId }) => {
  const {
    error, loading, publishDraft, publishMutation
  } = usePublishMutation(queryName)
  console.log('🚀 ~ TestComponent ~ loading:', loading)

  return (
    <div>
      <button type="button" onClick={() => publishMutation('Tool', customNativeId || 'test-native-id')}>
        Publish Tool
      </button>
      <button type="button" onClick={() => publishMutation('Visualization', customNativeId || 'test-native-id-draft')}>
        Publish Visualization
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
        publishDraft && (
          <span>
            Published:
            {' '}
            {publishDraft.conceptId}
          </span>
        )
      }
    </div>
  )
}

const setup = (overrideMocks = [], initialEntries = ['/drafts/TD1000000-MMT']) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={overrideMocks}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/drafts/:conceptId" element={<TestComponent queryName="tools" />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )

  return { user }
}

describe('usePublishMutation', () => {
  describe('when publishing a concept', () => {
    test('calls publishDraftMutation with the correct variables', async () => {
      const mocks = [{
        request: {
          query: PUBLISH_DRAFT,
          variables: {
            draftConceptId: 'TD1000000-MMT',
            nativeId: 'test-native-id',
            ummVersion: getUmmVersion('Tool')
          }
        },
        result: {
          data: {
            publishDraft: {
              conceptId: 'T1000000-MMT',
              revisionId: '1'
            }
          }
        }
      }]

      const { user } = setup(mocks)

      const publishButton = screen.getByText('Publish Tool')
      await user.click(publishButton)

      await waitFor(() => {
        expect(screen.getByText('Published: T1000000-MMT')).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })
  })

  describe('when publishing a Visualization concept', () => {
    test('removes "-draft" from the nativeId before calling publishDraftMutation', async () => {
      const mocks = [{
        request: {
          query: PUBLISH_DRAFT,
          variables: {
            draftConceptId: 'VISD1000000-MMT',
            nativeId: 'test-native-id',
            ummVersion: getUmmVersion('Visualization')
          }
        },
        result: {
          data: {
            publishDraft: {
              conceptId: 'VIS1000000-MMT',
              revisionId: '1'
            }
          }
        }
      }]

      const { user } = setup(mocks, ['/drafts/VISD1000000-MMT'])

      const publishButton = screen.getByText('Publish Visualization')
      await user.click(publishButton)

      await waitFor(() => {
        expect(screen.getByText('Published: VIS1000000-MMT')).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    })
  })

  test('does not modify nativeId for Visualization concepts when -draft is not present', async () => {
    const mocks = [{
      request: {
        query: PUBLISH_DRAFT,
        variables: {
          draftConceptId: 'VISD1000000-MMT',
          nativeId: 'test-native-id', // Note: no -draft suffix
          ummVersion: getUmmVersion('Visualization')
        }
      },
      result: {
        data: {
          publishDraft: {
            conceptId: 'VIS1000000-MMT',
            revisionId: '1'
          }
        }
      }
    }]

    // We need to modify the setup to allow passing a custom nativeId
    const customSetup = (customMocks, initialEntries) => {
      const user = userEvent.setup()
      render(
        <MockedProvider mocks={customMocks}>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route
                path="/drafts/:conceptId"
                element={
                  (
                    <TestComponent
                      queryName="visualizations"
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

    const { user } = customSetup(mocks, ['/drafts/VISD1000000-MMT'])

    const publishButton = screen.getByText('Publish Visualization')
    await user.click(publishButton)

    await waitFor(() => {
      expect(screen.getByText('Published: VIS1000000-MMT')).toBeInTheDocument()
    })
  })

  describe('when the publishDraftMutation encounters an error', () => {
    test('sets the error state', async () => {
      const mocks = [{
        request: {
          query: PUBLISH_DRAFT,
          variables: {
            draftConceptId: 'TD1000000-MMT',
            nativeId: 'test-native-id',
            ummVersion: getUmmVersion('Tool')
          }
        },
        error: new Error('An error occurred')
      }]

      const { user } = setup(mocks)

      const publishButton = screen.getByText('Publish Tool')
      await user.click(publishButton)

      await waitFor(() => {
        expect(screen.getByText('Error: An error occurred')).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText(/Published:/)).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    test('sets error state when mutation fails', async () => {
      const errorMessage = 'Test error message'
      const mocks = [{
        request: {
          query: PUBLISH_DRAFT,
          variables: {
            draftConceptId: 'TD1000000-MMT',
            nativeId: 'test-native-id',
            ummVersion: getUmmVersion('Tool')
          }
        },
        error: new Error(errorMessage)
      }]

      const { user } = setup(mocks)

      const publishButton = screen.getByText('Publish Tool')

      // Click the button
      await user.click(publishButton)

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
      })

      // Ensure that loading state is false
      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      // Ensure that publishDraft state wasn't set
      expect(screen.queryByText(/Published:/)).not.toBeInTheDocument()
    })
  })
})
