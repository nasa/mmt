import React, { Suspense } from 'react'
import userEvent from '@testing-library/user-event'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

import AppContext from '@/js/context/AppContext'
import NotificationsContext from '@/js/context/NotificationsContext'

import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'

import errorLogger from '@/js/utils/errorLogger'

import DraftCollectionAssociation from '../DraftCollectionAssociation'

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/removeMetadataKeys')

const mockDraft = {
  conceptId: 'VD120000000-MMT_2',
  conceptType: 'variable-draft',
  deleted: false,
  name: 'Test Collection Association',
  nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
  providerId: 'MMT_2',
  revisionDate: '2024-02-14T19:39:36.417Z',
  revisionId: '20',
  ummMetadata: {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
      Name: 'UMM-Var',
      Version: '1.9.0'
    },
    Definition: 'A sample variable1 record',
    Name: 'Test Collection Association',
    LongName: 'A sample record for demo',
    VariableType: 'ANCILLARY_VARIABLE',
    _private: {
      CollectionAssociation: {
        collectionConceptId: 'C1200000112-MMT_2',
        shortName: 'Association 1',
        version: '1'
      }
    }
  },
  previewMetadata: {
    additionalIdentifiers: null,
    associationDetails: null,
    conceptId: 'VD120000000-MMT_2',
    dataType: null,
    definition: 'A sample variable1 record',
    dimensions: null,
    fillValues: null,
    indexRanges: null,
    instanceInformation: null,
    longName: 'A sample record for demo',
    measurementIdentifiers: null,
    name: 'Test Collection Association',
    pageTitle: 'Test Collection Association',
    nativeId: 'Mock Native Id',
    offset: null,
    relatedUrls: null,
    revisionId: '20',
    samplingIdentifiers: null,
    scale: null,
    scienceKeywords: null,
    sets: null,
    standardName: null,
    units: null,
    validRanges: null,
    variableSubType: null,
    variableType: 'ANCILLARY_VARIABLE',
    __typename: 'Variable'
  },
  __typename: 'Draft'
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mocks = [{
    request: {
      query: conceptTypeDraftQueries.Variable,
      variables: {
        params: {
          conceptId: 'VD120000000-MMT_2',
          conceptType: 'Variable'
        }
      }
    },
    result: {
      data: {
        draft: mockDraft
      }
    }
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <AppContext.Provider value={
      {
        providerId: 'MMT_2',
        keywords: {}
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={['/drafts/variables/VD120000000-MMT_2/collection-association']}>
          <MockedProvider
            mocks={overrideMocks || mocks}
          >
            <Routes>
              <Route
                path="/drafts/variables"
              >
                <Route
                  path=":conceptId/collection-association"
                  element={
                    (
                      <ErrorBoundary>
                        <Suspense>
                          <DraftCollectionAssociation />
                        </Suspense>
                      </ErrorBoundary>
                    )
                  }
                />
              </Route>
            </Routes>
          </MockedProvider>
        </MemoryRouter>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user
  }
}

describe('Draft Collection Association', () => {
  describe('when the draft has a collection associated', () => {
    test('renders the association details in the Currently Selected Collection table', async () => {
      setup({})

      expect(await screen.findByText('C1200000112-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('Association 1')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test('calls errorLogger and returns an ErrorBanner', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association'],
        overrideMocks: [
          {
            request: {
              query: conceptTypeDraftQueries.Variable,
              variables: {
                params: {
                  conceptId: 'VD120000000-MMT_2',
                  conceptType: 'Variable'
                }
              }
            },
            result: {
              errors: [new GraphQLError('An error occurred')]
            }
          }
        ]
      })

      await waitFor(() => {
        expect(ErrorBanner).toHaveBeenCalledWith({
          dataTestId: 'error-banner__message',
          message: 'An error occurred'
        }, {})
      })

      expect(ErrorBanner).toHaveBeenCalledTimes(2)
    })
  })

  describe('when removing a collection association', () => {
    test('removes the saved collection association', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association'],
        additionalMocks: [{
          request: {
            query: INGEST_DRAFT,
            variables: {
              conceptType: 'Variable',
              nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
              providerId: 'MMT_2',
              ummVersion: '1.9.0'
            }
          },
          result: {
            data: {
              ingestDraft: {
                conceptId: 'VD120000000-MMT_2',
                revisionId: '3'
              }
            }
          }
        }]
      })

      const clearButton = await screen.findByRole('button', { name: 'Clear Collection Association' })

      await user.click(clearButton)

      expect(screen.getByText('No Collection Selected')).toBeInTheDocument()
    })

    test('error when saving a draft', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      const { user } = setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association'],
        additionalMocks: [{
          request: {
            query: INGEST_DRAFT,
            variables: {
              conceptType: 'Variable',
              nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
              providerId: 'MMT_2',
              ummVersion: '1.9.0'
            }
          },
          error: new Error('An error occurred')
        }]
      })

      const clearButton = await screen.findByRole('button', { name: 'Clear Collection Association' })

      await user.click(clearButton)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
    })
  })

  describe('when the initial draft does not have a collection associated', () => {
    test('should show no collection association', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: conceptTypeDraftQueries.Variable,
            variables: {
              params: {
                conceptId: 'VD120000000-MMT_2',
                conceptType: 'Variable'
              }
            }
          },
          result: {
            data: {
              draft: {
                conceptId: 'VD120000000-MMT_2',
                conceptType: 'variable-draft',
                deleted: false,
                name: 'Test Collection Association',
                nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
                providerId: 'MMT_2',
                revisionDate: '2024-02-14T19:39:36.417Z',
                revisionId: '20',
                ummMetadata: {
                  MetadataSpecification: {
                    URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
                    Name: 'UMM-Var',
                    Version: '1.9.0'
                  },
                  Definition: 'A sample variable1 record',
                  Name: 'Test Collection Association',
                  LongName: 'A sample record for demo',
                  VariableType: 'ANCILLARY_VARIABLE'
                },
                previewMetadata: {
                  additionalIdentifiers: null,
                  associationDetails: null,
                  conceptId: 'VD120000000-MMT_2',
                  dataType: null,
                  definition: 'A sample variable1 record',
                  dimensions: null,
                  fillValues: null,
                  indexRanges: null,
                  instanceInformation: null,
                  longName: 'A sample record for demo',
                  measurementIdentifiers: null,
                  name: 'Test Collection Association',
                  pageTitle: 'Test Collection Association',
                  nativeId: 'Mock Native Id',
                  offset: null,
                  relatedUrls: null,
                  revisionId: '20',
                  samplingIdentifiers: null,
                  scale: null,
                  scienceKeywords: null,
                  sets: null,
                  standardName: null,
                  units: null,
                  validRanges: null,
                  variableSubType: null,
                  variableType: 'ANCILLARY_VARIABLE',
                  __typename: 'Variable'
                },
                __typename: 'Draft'
              }
            }
          }
        }]
      })

      expect(await screen.findByText('No Collection Selected')).toBeInTheDocument()
    })
  })
})
