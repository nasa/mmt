import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import * as router from 'react-router'
import { Cookies, CookiesProvider } from 'react-cookie'
import conceptTypeQueries from '../../../constants/conceptTypeQueries'
import Providers from '../../../providers/Providers/Providers'
import MetadataPreview from '../../MetadataPreview/MetadataPreview'
import PublishPreview from '../PublishPreview'
import errorLogger from '../../../utils/errorLogger'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import constructDownloadableFile from '../../../utils/constructDownloadableFile'
import { GET_TOOL } from '../../../operations/queries/getTool'
import { DELETE_TOOL } from '../../../operations/mutations/deleteTool'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'
import {
  noTagsOrGranulesCollection,
  publishCollectionRecord,
  publishedVariableRecord,
  recordWithRevisions,
  collectionRecordWithRevisions,
  variableRecordWithRevisions
} from './__mocks__/publishPreview'
import { GET_TOOLS } from '../../../operations/queries/getTools'
import { GET_COLLECTION_REVISIONS } from '../../../operations/queries/getCollectionRevisions'

vi.mock('../../../utils/constructDownloadableFile')
vi.mock('../../MetadataPreview/MetadataPreview')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../../utils/errorLogger')

global.fetch = vi.fn()

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid'
  }
})

const mock = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: null,
  conceptId: 'TL1200000180-MMT_2',
  collections: null,
  contactGroups: null,
  contactPersons: null,
  description: 'asfd',
  doi: null,
  nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
  lastUpdatedDate: null,
  longName: 'test',
  metadataSpecification: {
    url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    name: 'UMM-T',
    version: '1.2.0'
  },
  name: 'Testing tools for publiush asdfasfd',
  organizations: [
    {
      roles: [
        'SERVICE PROVIDER'
      ],
      shortName: 'ESA/ED',
      longName: 'Educational Office, Ecological Society of America',
      urlValue: 'http://www.esa.org/education/'
    }
  ],
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisionId: '1',
  revisionDate: '2024-01-19T20:00:56.974Z',
  relatedUrls: null,
  searchAction: null,
  supportedBrowsers: null,
  supportedInputFormats: null,
  supportedOperatingSystems: null,
  supportedOutputFormats: null,
  supportedSoftwareLanguages: null,
  toolKeywords: [
    {
      toolCategory: 'EARTH SCIENCE SERVICES',
      toolTopic: 'DATA ANALYSIS AND VISUALIZATION',
      toolTerm: 'CALIBRATION/VALIDATION'
    }
  ],
  type: 'Web User Interface',
  ummMetadata: {},
  url: {
    urlContentType: 'DistributionURL',
    type: 'DOWNLOAD SOFTWARE',
    subtype: 'MOBILE APP',
    urlValue: 'adfs'
  },
  useConstraints: null,
  version: '1',
  versionDescription: null,
  __typename: 'Tool'

}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  overrideInitialEntries,
  overridePath,
  overridePathValue,
  overrideProps = {}
}) => {
  const props = {
    isRevision: false,
    ...overrideProps
  }
  const mocks = [{
    request: {
      query: conceptTypeQueries.Tool,
      variables: {
        params: {
          conceptId: 'T1000000-MMT'
        }
      }
    },
    result: {
      data: {
        tool: mock
      }
    }
  },
  {
    request: {
      query: GET_TOOLS,
      variables: {
        params: {
          conceptId: 'T1000000-MMT',
          allRevisions: true
        }
      }
    },
    result: {
      data: {
        tools: recordWithRevisions
      }
    }
  },
  ...additionalMocks]

  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const cookie = new Cookies(
    {
      loginInfo: ({
        providerId: 'MMT_2',
        name: 'User Name',
        token: {
          tokenValue: 'ABC-1',
          tokenExp: expires.valueOf()
        }
      })
    }
  )
  cookie.HAS_DOCUMENT_COOKIE = false

  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <Providers>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <MemoryRouter initialEntries={overrideInitialEntries || ['/tools/T1000000-MMT/1']}>
            <Routes>
              <Route
                path={overridePath || '/tools'}
              >
                <Route
                  path={overridePathValue || ':conceptId/:revisionId'}
                  element={<PublishPreview {...props} />}
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </Providers>
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('PublishPreview', () => {
  describe('when the publish page is called', () => {
    test('renders a Publish Preview with a Published Tool Preview', async () => {
      setup({})
      await waitForResponse()

      expect(MetadataPreview).toHaveBeenCalledTimes(1)
      expect(MetadataPreview).toHaveBeenCalledWith({
        conceptId: 'T1000000-MMT',
        conceptType: 'Tool',
        previewMetadata: {
          __typename: 'Tool',
          accessConstraints: null,
          ancillaryKeywords: null,
          associationDetails: null,
          conceptId: 'TL1200000180-MMT_2',
          collections: null,
          contactGroups: null,
          contactPersons: null,
          description: 'asfd',
          doi: null,
          lastUpdatedDate: null,
          longName: 'test',
          metadataSpecification: {
            name: 'UMM-T',
            url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            version: '1.2.0'
          },
          name: 'Testing tools for publiush asdfasfd',
          nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
          organizations: [
            {
              longName: 'Educational Office, Ecological Society of America',
              roles: [
                'SERVICE PROVIDER'
              ],
              shortName: 'ESA/ED',
              urlValue: 'http://www.esa.org/education/'
            }
          ],
          potentialAction: null,
          providerId: 'MMT_2',
          quality: null,
          relatedUrls: null,
          revisionDate: '2024-01-19T20:00:56.974Z',
          revisionId: '1',
          searchAction: null,
          supportedBrowsers: null,
          supportedInputFormats: null,
          supportedOperatingSystems: null,
          supportedOutputFormats: null,
          supportedSoftwareLanguages: null,
          toolKeywords: [
            {
              toolCategory: 'EARTH SCIENCE SERVICES',
              toolTerm: 'CALIBRATION/VALIDATION',
              toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
            }
          ],
          type: 'Web User Interface',
          ummMetadata: {},
          url: {
            subtype: 'MOBILE APP',
            type: 'DOWNLOAD SOFTWARE',
            urlContentType: 'DistributionURL',
            urlValue: 'adfs'
          },
          useConstraints: null,
          version: '1',
          versionDescription: null
        }
      }, {})
    })
  })

  describe('when the request results in an error', () => {
    test('call errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_TOOL,
              variables: {
                params: {
                  conceptId: 'T1000000-MMT'
                }
              }
            },
            error: new Error('An error occurred')
          },
          {
            request: {
              query: GET_TOOLS,
              variables: {
                params: {
                  conceptId: 'T1000000-MMT',
                  allRevisions: true
                }
              }
            },
            result: {
              data: {
                tools: recordWithRevisions
              }
            }
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview getPublish Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the record could not be returned after 10 try', () => {
    test('calls errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: conceptTypeQueries.Tool,
              variables: {
                params: {
                  conceptId: 'T1000000-MMT'
                }
              }
            },
            result: {
              data: {
                tool: null
              }
            }
          },
          {
            request: {
              query: GET_TOOLS,
              variables: {
                params: {
                  conceptId: 'T1000000-MMT',
                  allRevisions: true
                }
              }
            },
            result: {
              data: {
                tools: recordWithRevisions
              }
            }
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Max retries allowed', 'Publish Preview: getMetadata Query')
    })
  })

  describe('when clicking the delete button', () => {
    test('show the DeleteModal', async () => {
      const { user } = setup({})

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Delete/ })
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete this record?')).toBeInTheDocument()
    })
  })

  describe('when clicking the Yes button in the modal', () => {
    test('calls the deletePublish mutation and navigates to the /tools page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [{
          request: {
            query: DELETE_TOOL,
            variables: {
              nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
              providerId: 'MMT_2'
            }
          },
          result: {
            data: {
              deleteTool: {
                conceptId: 'T1000000-MMT',
                revisionId: '1'
              }
            }
          }
        }]
      })

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Delete/ })
      await user.click(button)

      const yesButton = screen.getByRole('button', { name: 'Yes' })
      await user.click(yesButton)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/manage/tools')
    })
  })

  describe('when clicking the Yes button in the modal results in an error', () => {
    test('calls addNotification and errorLogger', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [{
          request: {
            query: DELETE_TOOL,
            variables: {
              nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
              providerId: 'MMT_2'
            }
          },
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Delete/ })
      await user.click(button)

      const yesButton = screen.getByRole('button', { name: 'Yes' })
      await user.click(yesButton)

      await waitForResponse()
      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview: deleteMutation')
    })
  })

  describe('when clicking the No Button in the modal', () => {
    test('calls the the deleteModal and clicks no', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      const { user } = setup({})

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Delete/ })

      await user.click(button)

      const noButton = screen.getByRole('button', { name: 'No' })
      await user.click(noButton)

      expect(navigateSpy).toHaveBeenCalledTimes(0)
    })
  })

  describe('when clicking on Edit Tool Record button', () => {
    test('calls the ingestDraftMutation and navigates to /drafts/tool/conceptId page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [{
          request: {
            query: INGEST_DRAFT,
            variables: {
              conceptType: 'Tool',
              metadata: {},
              nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
              providerId: 'MMT_2',
              ummVersion: '1.2.0'
            }
          },
          result: {
            data: {
              ingestDraft: {
                conceptId: 'TD1000000-MMT',
                revisionId: '3'
              }
            }
          }
        }]
      })

      await waitForResponse()

      const editButton = screen.getByRole('button', { name: /Edit/ })
      await user.click(editButton)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT')
    })

    test('when ingest mutation returns an error', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [{
          request: {
            query: INGEST_DRAFT,
            variables: {
              conceptType: 'Tool',
              nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
              metadata: {},
              providerId: 'MMT_2',
              ummVersion: '1.2.0'
            }
          },
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      const editButton = screen.getByRole('button', { name: /Edit/ })
      await user.click(editButton)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(0)
      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview ingestDraftMutation Query')
    })
  })

  describe('when clicking on Clone Tool Record button', () => {
    test('calls ingestDraft Mutation and navigates to /drafts/tool/conceptId page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        additionalMocks: [{
          request: {
            query: INGEST_DRAFT,
            variables: {
              conceptType: 'Tool',
              metadata: {},
              nativeId: 'MMT_mock-uuid',
              providerId: 'MMT_2',
              ummVersion: '1.2.0'
            }
          },
          result: {
            data: {
              ingestDraft: {
                conceptId: 'TD1000000-MMT',
                revisionId: '3'
              }
            }
          }
        }]
      })

      await waitForResponse()

      const editButton = screen.getByRole('button', { name: /Clone/ })
      await user.click(editButton)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT')
    })
  })

  describe('when clicking on Download Tool Record button', () => {
    test('downloads the Tool Record', async () => {
      const { user } = setup({})

      await waitForResponse()

      const moreActionsButton = screen.queryByText(/More Actions/)

      await user.click(moreActionsButton)

      const downloadButton = screen.getByRole('button', { name: /Download JSON/ })
      await user.click(downloadButton)

      await waitForResponse()

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify(mock.ummMetadata, null, 2),
        'T1000000-MMT'
      )
    })
  })

  describe('when clicking on Manage Collection Association', () => {
    test('should navigate to /collection-association', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideInitialEntries: ['/tools/T1000000-MMT'],
        overridePathValue: ':conceptId'
      })

      await waitForResponse()

      const moreActionsButton = screen.queryByText(/More Actions/)

      await user.click(moreActionsButton)

      const manageCollectionAssociationBtn = screen.getByRole('button', { name: 'Collection Associations' })
      await user.click(manageCollectionAssociationBtn)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT/collection-association')
    })
  })

  describe('Variables Preview', () => {
    describe('when editing a publish variable', () => {
      test('should navigate to /drafts/variable/conceptId page', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          overrideInitialEntries: ['/variables/V1000000-MMT/1'],
          overridePath: '/variables',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Variable,
                variables: {
                  params: {
                    conceptId: 'V1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  variable: publishedVariableRecord
                }
              }
            },
            {
              request: {
                query: conceptTypeQueries.Variables,
                variables: {
                  params: {
                    conceptId: 'V1000000-MMT',
                    allRevisions: true
                  }
                }
              },
              result: {
                data: {
                  variables: variableRecordWithRevisions
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
                        collectionConceptId: 'C1200000115-MMT_2',
                        shortName: 'CIESIN_SEDAC_ESI_2000',
                        version: '2000.00'
                      }
                    },
                    MetadataSpecification: {
                      URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
                      Name: 'UMM-Var',
                      Version: '1.9.0'
                    },
                    AdditionalIdentifiers: [{ Identifier: 'dfag' }],
                    Name: 'Variable Test',
                    LongName: 'Mock Long Name',
                    Definition: 'Mock Definition'
                  },
                  nativeId: 'MMT_d2f6c3da-44d7-47b1-8d8a-324c60235de4',
                  providerId: 'MMT_2',
                  ummVersion: '1.9.0'
                }
              },
              result: {
                data: {
                  ingestDraft: {
                    conceptId: 'VD1000000-MMT',
                    revisionId: '1'
                  }
                }
              }
            }
          ]
        })

        await waitForResponse()

        const editButton = screen.getByRole('button', { name: /Edit/ })
        await user.click(editButton)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/variables/VD1000000-MMT')
      })
    })
  })

  describe('when clicking on Alert Banner', () => {
    test('should navigate to latest published revision', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideInitialEntries: ['/tools/T1000000-MMT/revisions/1'],
        overridePathValue: ':conceptId/revisions/:revisionId',
        overrideProps: {
          isRevision: true
        }
      })

      await waitForResponse()

      const viewLatestPublishedRevision = screen.getByRole('button', { name: 'Click here to view the latest published revision' })
      await user.click(viewLatestPublishedRevision)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT')
    })
  })

  describe('when called from /type/conceptId/revisions/revisionId', () => {
    test('renders Revisions button with revisions count and the navigates to correct page', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({
        overrideInitialEntries: ['/tools/T1000000-MMT/revisions/1'],
        overridePathValue: ':conceptId/revisions/:revisionId',
        overrideProps: {
          isRevision: true
        }
      })

      await waitForResponse()

      const moreActionsButton = screen.queryByText(/More Actions/)

      await user.click(moreActionsButton)

      const revisionsButton = screen.getByRole('button', { name: 'View Revisions 2' })

      await user.click(revisionsButton)

      await waitForResponse()

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT/revisions')
    })
  })

  describe('Collection Preview', () => {
    describe('Create Associated Variable', () => {
      describe('when clicking on Create Collection', () => {
        test('should navigate to variable draft preview', async () => {
          const navigateSpy = vi.fn()
          vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

          const { user } = setup({
            overrideInitialEntries: ['/collections/C1000000-MMT/1'],
            overridePath: '/collections',
            overrideMocks: [
              {
                request: {
                  query: conceptTypeQueries.Collection,

                  variables: {
                    params: {
                      conceptId: 'C1000000-MMT',
                      includeTags: '*'
                    }
                  }
                },
                result: {
                  data: {
                    collection: publishCollectionRecord
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
                          collectionConceptId: 'C1200000100-MMT_2',
                          shortName: 'Mock Quick Test Services #2',
                          version: '1'
                        }
                      }
                    },
                    nativeId: 'MMT_mock-uuid',
                    providerId: 'MMT_2',
                    ummVersion: '1.9.0'
                  }
                },
                result: {
                  data: {
                    ingestDraft: {
                      conceptId: 'VD1000000-MMT',
                      revisionId: '1'
                    }
                  }
                }
              },
              {
                request: {
                  query: GET_COLLECTION_REVISIONS,
                  variables: {
                    params: {
                      conceptId: 'C1000000-MMT',
                      allRevisions: true
                    }
                  }
                },
                result: {
                  data: {
                    collections: collectionRecordWithRevisions
                  }
                }
              }
            ]
          })

          await waitForResponse()

          const moreActionsButton = screen.queryByText(/More Actions/)

          await user.click(moreActionsButton)

          const createVariableAssociationBtn = screen.getByRole('button', { name: 'Create Associated Variable' })

          await user.click(createVariableAssociationBtn)

          expect(navigateSpy).toHaveBeenCalledTimes(1)
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/variables/VD1000000-MMT')
        })
      })
    })
  })

  describe('Tags', () => {
    describe('when the collection has tags', () => {
      test('should display the tag modal and close the modal', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    includeTags: '*'
                  }
                }
              },
              result: {
                data: {
                  collection: publishCollectionRecord
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_REVISIONS,
                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    allRevisions: true
                  }
                }
              },
              result: {
                data: {
                  collections: collectionRecordWithRevisions
                }
              }
            }
          ]
        })

        await waitForResponse()

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        const tagBtn = screen.getByRole('button', { name: 'View Tags 1' })
        await user.click(tagBtn)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).queryByText('1 tag')).toBeInTheDocument()
        expect(within(modal).queryByText('Tag Key:')).toBeInTheDocument()
        expect(within(modal).queryByText('Description:')).toBeInTheDocument()
        expect(within(modal).queryByText('Mock tag description')).toBeInTheDocument()

        const closeButton = within(modal).queryByRole('button', { name: 'Close' })

        await user.click(closeButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when the collection has no tags', () => {
      test('should display the with no tag message', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    includeTags: '*'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesCollection
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_REVISIONS,
                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    allRevisions: true
                  }
                }
              },
              result: {
                data: {
                  collections: collectionRecordWithRevisions
                }
              }
            }
          ]
        })

        await waitForResponse()

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        const tagBtn = screen.getByRole('button', { name: 'View Tags 0' })
        await user.click(tagBtn)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).queryByText('There are no tags associated with this collection')).toBeInTheDocument()
      })
    })
  })

  describe('Granules', () => {
    describe('when the collection has granules', () => {
      test('should display the granule count', async () => {
        const user = userEvent.setup()

        setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    includeTags: '*'
                  }
                }
              },
              result: {
                data: {
                  collection: publishCollectionRecord
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_REVISIONS,
                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    allRevisions: true
                  }
                }
              },
              result: {
                data: {
                  collections: collectionRecordWithRevisions
                }
              }
            }
          ]
        })

        await waitForResponse()

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Granules 1' }))
      })
    })

    describe('when the collection has no granules', () => {
      test('should display the granule count with 0', async () => {
        const user = userEvent.setup()

        setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    includeTags: '*'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesCollection
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_REVISIONS,
                variables: {
                  params: {
                    conceptId: 'C1000000-MMT',
                    allRevisions: true
                  }
                }
              },
              result: {
                data: {
                  collections: collectionRecordWithRevisions
                }
              }
            }
          ]
        })

        await waitForResponse()

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Granules 0' }))
      })
    })
  })
})
