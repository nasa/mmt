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
import { Cookies, CookiesProvider } from 'react-cookie'
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

global.fetch = jest.fn()

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
  overrideMocks = false,
  overrideInitialEntries = []
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

  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <MemoryRouter initialEntries={overrideInitialEntries}>
        <Providers>
          <MockedProvider
            mocks={overrideMocks || mocks}
          >
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
          </MockedProvider>
        </Providers>
      </MemoryRouter>
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('CollectionAssociation', () => {
  describe('when the draft has a collection associated', () => {
    test('renders the association details in the Currently Selected Collection table', async () => {
      setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association']

      })

      await waitForResponse()

      expect(screen.getByText('C1200000112-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('Association 1')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test('calls errorLogger and returns an ErrorBanner', async () => {
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

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when searching for collections', () => {
    test('renders a list of collection', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
        additionalMocks: [{
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 20,
                offset: 0,
                provider: 'MMT_2',
                sortKey: null,
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
                    tags: 1,
                    granules: null,
                    shortName: 'Collection Associations Short Name 1',
                    entryTitle: 'Collection Associations Entry Title 1 ',
                    title: 'Collection Associations Title 1',
                    revisionDate: null,
                    __typename: 'Collection'
                  }
                ],
                count: 0,
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
    })

    test('when there an error to get the list of collections', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
        additionalMocks: [{
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 20,
                offset: 0,
                provider: 'MMT_2',
                sortKey: null,
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

    describe('when searching for temporal extent', () => {
      // Todo:
      // Spent part of afternoon with Deep, no resolution on this
      // test below.
      // For whatever reason the test below is not working on
      // intel (older  machines), works fine on Deep's machine (silicon)
      // though.   Maybe some kind of race condition?
      // (verified same version of node, npm, env vars, etc.)
      // Also strange test works fine running as a single file, just does
      // not work when run in the full test suite (e.g. npm run test)
      // Need to revisit this.
      test.skip('show fill out temporal extent form', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
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
                        tags: 1,
                        granules: null,
                        entryTitle: 'Collection Association Entry Title 1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        revisionDate: null,
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
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
                    temporal: '1978-01-01T00:00:00.000Z,1978-01-01T00:00:00.000Z'
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
                        tags: 1,
                        granules: null,
                        entryTitle: 'Collection Association Entry Title 1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        revisionDate: null,
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
                    _private: {
                      CollectionAssociation: {
                        collectionConceptId: 'C12000001123-MMT_2',
                        shortName: 'Collection Associations Short Name 1',
                        version: '1'
                      }
                    }
                  },
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

        const selectField = screen.getByText('Temporal Extent')
        await user.click(selectField)
        await waitForResponse()

        const startField = screen.getByText('Range Start')
        await user.type(startField, '1978-01-01T00:00:00Z')

        const endField = screen.getByText('Range End')
        await user.type(endField, '1978-01-01T00:00:00Z')

        const searchForCollections = screen.getByText('Search for Collection')
        await user.click(searchForCollections)

        expect(screen.getByText('Collection Associations Short Name 1')).toBeInTheDocument()
      })
    })

    describe('when associating a collection', () => {
      test('should associate the collection to the draft and navigate', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        const { user } = setup({
          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
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
                        tags: 1,
                        granules: null,
                        entryTitle: 'Collection Association Entry Title 1',
                        shortName: 'Collection Associations Short Name 1',
                        title: 'Collection Associations Title 1',
                        revisionDate: null,
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
        expect(navigateSpy).toHaveBeenCalledWith('?searchField=entryTitle&provider=MMT_2&searchFieldValue=*', undefined)
      })

      test('when there is an error associating a collection', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&provider=MMT_2&searchFieldValue=*'],
          additionalMocks: [
            {
              request: {
                query: GET_COLLECTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    provider: 'MMT_2',
                    sortKey: null,
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
                        entryTitle: 'Collection Associations Entry Title 1',
                        tags: null,
                        nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
                        granules: null,
                        revisionDate: null,
                        title: 'Collection Associations Title 1',
                        __typename: 'Collection'
                      }
                    ],
                    count: 1,
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
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&searchFieldValue=*&page=2'],
        additionalMocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 20,
                  provider: null,
                  sortKey: null,
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
                      entryTitle: 'Collection Associations Entry Title 1',
                      tags: null,
                      granules: null,
                      revisionDate: null,
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
                  sortKey: null,
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
                      entryTitle: 'Collection Associations Entry Title 2',
                      revisionDate: null,
                      tags: null,
                      granules: null,
                      title: 'Collection Associations Title 2',
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
                  offset: 40,
                  provider: 'MMT_2',
                  sortKey: null,
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
                      entryTitle: 'Collection Associations Entry Title 2',
                      revisionDate: null,
                      tags: null,
                      granules: null,
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
      const paginationButton = screen.getByRole('button', { name: 'Goto Page 3' })
      await user.click(paginationButton)

      expect(screen.getByText('Collection Associations Short Name 2')).toBeInTheDocument()
    })
  })

  describe('when clicking an ascending sort button', () => {
    test('sorts and shows the button as active', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/drafts/variables/VD120000000-MMT_2/collection-association?searchField=entryTitle&searchFieldValue=*&sortKey=-shortName'],
        additionalMocks: [
          {
            request: {
              query: GET_COLLECTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  provider: null,
                  sortKey: '-shortName',
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
                      entryTitle: 'Collection Associations Entry Title 1',
                      tags: null,
                      granules: null,
                      revisionDate: null,
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
                  sortKey: null,
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
                      entryTitle: 'Collection Associations Entry Title 2',
                      revisionDate: null,
                      tags: null,
                      granules: null,
                      title: 'Collection Associations Title 2',
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
                  offset: 0,
                  provider: 'MMT_2',
                  sortKey: '-shortName',
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
                      entryTitle: 'Collection Associations Entry Title 2',
                      revisionDate: null,
                      tags: null,
                      granules: null,
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

      const test = screen.getByRole('button', { name: /Sort Short Name in ascending order/ })
      await user.click(test)

      expect(screen.queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('d-flex align-items-center text-nowrap button--naked table__sort-button text-secondary d-flex justify-content-center btn')
    })
  })
})
