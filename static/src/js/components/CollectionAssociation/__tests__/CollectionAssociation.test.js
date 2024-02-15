import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import * as router from 'react-router'
import userEvent from '@testing-library/user-event'
import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'
import CollectionAssociation from '../CollectionAssociation'
import Providers from '../../../providers/Providers/Providers'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import errorLogger from '../../../utils/errorLogger'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'
import { GET_COLLECTIONS } from '../../../operations/queries/getCollections'

jest.mock('../../ErrorBanner/ErrorBanner')
jest.mock('../../../utils/errorLogger')
jest.mock('../../../utils/removeMetadataKeys')

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

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

  render(
    <MockedProvider
      mocks={overrideMocks || mocks}
    >
      <Providers>
        <MemoryRouter initialEntries={['/drafts/variables/VD120000000-MMT_2/collection-association']}>
          <Routes>
            <Route
              path="/drafts/variables"
            >
              <Route
                path=":conceptId/collection-association"
                element={<CollectionAssociation />}
              />
            </Route>
          </Routes>

        </MemoryRouter>
      </Providers>

    </MockedProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('CollectionAssociation', () => {
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
    test('calls errorLogger and returns an ErrorBanner', async () => {
      setup({
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
            error: new Error('An error occurred')
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to retrieve draft', 'Collection Association: getDraft Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when removing a collection association', () => {
    test('removes the saved collection association', async () => {
      const { user } = setup({
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

      expect(screen.getByText('C1200000112-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('Association 1')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    test('error when saving a draft', async () => {
      const { user } = setup({
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

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when searching for collections', () => {
    test('renders a list of collection', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 20,
                offset: 0,
                provider: 'MMT_2',
                options: { entryTitle: { pattern: true } },
                entryTitle: '*'
              }
            }
          },
          result: {
            data: {
              collections: {
                items: [
                  {
                    conceptId: 'C12000001123-MMT_2',
                    provider: 'MMT_2',
                    version: '1',
                    shortName: 'Collection Associations Short Name 1',
                    title: 'Collection Associations Title 1',
                    __typename: 'Collection'
                  }
                ],
                count: 50,
                __typename: 'CollectionList'
              }
            }
          }
        }]
      })
      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await waitForResponse()

      expect(screen.getByText('Collection Associations Short Name 1')).toBeInTheDocument()
      expect(screen.getByText('C12000001123-MMT_2')).toBeInTheDocument()
    })

    test('when there an error to get the list of collections', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 20,
                offset: 0,
                provider: 'MMT_2',
                options: { entryTitle: { pattern: true } },
                entryTitle: '*'
              }
            }
          },
          error: new Error('An error occurred')
        }]
      })
      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get Collections', 'Collection Association: getCollections Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })

    describe('when associating a collection', () => {
      test('should associate the collection to the draft and navigate', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    options: { entryTitle: { pattern: true } },
                    entryTitle: '*'
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'C12000001123-MMT_2',
                        provider: 'MMT_2',
                        version: '1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        __typename: 'Collection'
                      }
                    ],
                    count: 25,
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Variable',
                  metadata: {
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
                        collectionConceptId: 'C12000001123-MMT_2',
                        shortName: 'Collection Associations Short Name 1',
                        version: '1'
                      }
                    }
                  },
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
            }
          ]
        })
        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')
        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        await waitForResponse()
        const createAssociation = screen.getByRole('button', { name: 'Create Association' })
        await user.click(createAssociation)
        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/variables/VD120000000-MMT_2')
      })

      test('when there is an error associating a collection', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    options: { entryTitle: { pattern: true } },
                    entryTitle: '*'
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'C12000001123-MMT_2',
                        provider: 'MMT_2',
                        version: '1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        __typename: 'Collection'
                      }
                    ],
                    count: 25,
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Variable',
                  metadata: {
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
                        collectionConceptId: 'C12000001123-MMT_2',
                        shortName: 'Collection Associations Short Name 1',
                        version: '1'
                      }
                    }
                  },
                  nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
                  providerId: 'MMT_2',
                  ummVersion: '1.9.0'
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })
        await waitForResponse()

        const searchField = screen.getByText('Select Search Field')
        await user.click(searchField)

        const selectField = screen.getByText('Entry Title')
        await user.click(selectField)

        const field = screen.getByRole('textbox')
        await user.type(field, '*')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        await waitForResponse()
        const createAssociation = screen.getByRole('button', { name: 'Create Association' })
        await user.click(createAssociation)
        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')

        expect(ErrorBanner).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        additionalMocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  provider: 'MMT_2',
                  options: { entryTitle: { pattern: true } },
                  entryTitle: '*'
                }
              }
            },
            result: {
              data: {
                collections: {
                  items: [
                    {
                      conceptId: 'C12000001123-MMT_2',
                      provider: 'MMT_2',
                      version: '1',
                      shortName: 'Collection Associations Short Name 1',
                      title: 'Collection Associations Title 1',
                      __typename: 'Collection'
                    }
                  ],
                  count: 50,
                  __typename: 'CollectionList'
                }
              }
            }
          },
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 20,
                  provider: 'MMT_2',
                  options: { entryTitle: { pattern: true } },
                  entryTitle: '*'
                }
              }
            },
            result: {
              data: {
                collections: {
                  items: [
                    {
                      conceptId: 'C12000001123-MMT_2',
                      provider: 'MMT_2',
                      version: '1',
                      shortName: 'Collection Associations Short Name 2',
                      title: 'Collection Associations Title 2',
                      __typename: 'Collection'
                    }
                  ],
                  count: 50,
                  __typename: 'CollectionList'
                }
              }
            }
          }
        ]
      })
      await waitForResponse()

      const searchField = screen.getByText('Select Search Field')
      await user.click(searchField)

      const selectField = screen.getByText('Entry Title')
      await user.click(selectField)

      const field = screen.getByRole('textbox')
      await user.type(field, '*')

      const searchForCollections = screen.getByText('Search for Collection')
      await user.click(searchForCollections)

      await waitForResponse()
      const nextPage = screen.getByRole('button', { name: '2' })
      await user.click(nextPage)

      expect(screen.getByText('Collection Associations Short Name 2')).toBeInTheDocument()
      expect(screen.getByText('C12000001123-MMT_2')).toBeInTheDocument()
    })
  })
})
