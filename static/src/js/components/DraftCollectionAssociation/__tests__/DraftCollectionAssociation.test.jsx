import React, { Suspense } from 'react'
import userEvent from '@testing-library/user-event'
import { Cookies } from 'react-cookie'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'
import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'
import DraftCollectionAssociation from '../DraftCollectionAssociation'
import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import errorLogger from '../../../utils/errorLogger'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/removeMetadataKeys')

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

  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const cookie = new Cookies({
    loginInfo: ({
      name: 'User Name',
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires.valueOf()
      },
      providerId: 'MMT_2'
    })
  })
  cookie.HAS_DOCUMENT_COOKIE = false

  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        },
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
    user: userEvent.setup()
  }
}

describe('Draft Collection Association', () => {
  describe('when the draft has a collection associated', () => {
    test('renders the association details in the Currently Selected Collection table', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('C1200000112-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('Association 1')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test.skip('calls errorLogger and returns an ErrorBanner', async () => {
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

      await waitForResponse()

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
      await waitForResponse()

      const clearButton = screen.getByRole('button', { name: 'Clear Collection Association' })

      await user.click(clearButton)

      await waitForResponse()

      expect(screen.getByText('No Collection Selected')).toBeInTheDocument()
    })

    test('error when saving a draft', async () => {
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
      await waitForResponse()

      const clearButton = screen.getByRole('button', { name: 'Clear Collection Association' })

      await user.click(clearButton)

      await waitForResponse()

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

      await waitForResponse()

      expect(screen.getByText('No Collection Selected')).toBeInTheDocument()
    })
  })
})
