import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import * as router from 'react-router'

import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import MetadataPreview from '@/js/components/MetadataPreview/MetadataPreview'

import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'

import errorLogger from '@/js/utils/errorLogger'
import constructDownloadableFile from '@/js/utils/constructDownloadableFile'
import stageConceptForProduction from '@/js/utils/stageConceptForProduction'

import { getApplicationConfig } from 'sharedUtils/getConfig'

import { DELETE_TOOL } from '@/js/operations/mutations/deleteTool'
import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'
import { GET_TOOLS } from '@/js/operations/queries/getTools'
import { GET_COLLECTION_REVISIONS } from '@/js/operations/queries/getCollectionRevisions'

import PublishPreview from '../PublishPreview'
import {
  collectionRecordWithRevisions,
  noTagsOrGranulesOrServicesOrCitationsCollection,
  publishCollectionRecord,
  publishedVariableRecord,
  recordWithRevisions,
  variableRecordWithRevisions
} from './__mocks__/publishPreview'

vi.mock('@/js/utils/constructDownloadableFile')
vi.mock('@/js/components/MetadataPreview/MetadataPreview')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/stageConceptForProduction')

vi.mock('sharedUtils/getConfig', async (importOriginal) => ({
  ...await importOriginal(),
  getApplicationConfig: vi.fn()
}))

vi.mock('@/js/hooks/useMMTCookie', () => ({
  __esModule: true,
  default: () => ({
    mmtJwt: 'mock-jwt'
  })
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(actual.useParams)
  }
})

const mock = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: null,
  conceptId: 'T1200000180-MMT_2',
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
  name: 'Testing tools for publish Preview',
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
  pageTitle: 'Testing tools for publish Preview',
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisions: {
    count: 2,
    items: []
  },
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
  ummMetadata: {
    Name: 'Testing tools for publish Preview',
    LongName: 'Mock Long Name',
    Description: 'Mock description'
  },
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

  const user = userEvent.setup()

  render(
    <NotificationsContextProvider>
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
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <PublishPreview {...props} />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </NotificationsContextProvider>
  )

  return {
    user
  }
}

describe('PublishPreview', () => {
  beforeEach(() => {
    // Staging is only offered in sit/uat, where it forwards to the next environment
    getApplicationConfig.mockReturnValue({ env: 'sit' })
  })

  describe('when the publish page is called', () => {
    test('renders a Publish Preview with a Published Tool Preview', async () => {
      setup({})

      expect(MetadataPreview).toHaveBeenCalledTimes(1)
      expect(MetadataPreview).toHaveBeenCalledWith({
        conceptId: 'T1000000-MMT',
        conceptType: 'Tool'
      }, {})
    })
  })

  describe('when clicking the delete button', () => {
    test('show the DeleteModal', async () => {
      const { user } = setup({})

      const button = await screen.findByRole('button', { name: /Delete/ })
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

      const button = await screen.findByRole('button', { name: /Delete/ })
      await user.click(button)

      const yesButton = screen.getByRole('button', { name: 'Yes' })

      await user.click(yesButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)

      expect(navigateSpy).toHaveBeenCalledWith('/tools')
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

      const button = await screen.findByRole('button', { name: /Delete/ })
      await user.click(button)

      const yesButton = screen.getByRole('button', { name: 'Yes' })
      await user.click(yesButton)

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview: deleteMutation')
    })
  })

  describe('when clicking the No Button in the modal', () => {
    test('calls the the deleteModal and clicks no', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      const { user } = setup({})

      const button = await screen.findByRole('button', { name: /Delete/ })

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
              metadata: {
                Name: 'Testing tools for publish Preview',
                LongName: 'Mock Long Name',
                Description: 'Mock description'
              },
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

      const editButton = await screen.findByRole('button', { name: /Edit/ })
      await user.click(editButton)

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
              metadata: {
                Name: 'Testing tools for publish Preview',
                LongName: 'Mock Long Name',
                Description: 'Mock description'
              },
              nativeId: 'MMT_PUBLISH_8b8a1965-67a5-415c-ae4c-8ecbafd84131',
              providerId: 'MMT_2',
              ummVersion: '1.2.0'
            }
          },
          error: new Error('An error occurred')
        }]
      })

      const editButton = await screen.findByRole('button', { name: /Edit/ })
      await user.click(editButton)

      expect(navigateSpy).toHaveBeenCalledTimes(0)
      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview: ingestDraftMutation Query')
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
              metadata: { Description: 'Mock description' },
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

      const editButton = await screen.findByRole('button', { name: /Clone/ })
      await user.click(editButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT')
    })
  })

  describe('when clicking on Download Tool Record button', () => {
    test('downloads the Tool Record', async () => {
      const { user } = setup({})

      const moreActionsButton = await screen.findByText(/More Actions/)

      await user.click(moreActionsButton)

      const downloadButton = screen.getByRole('button', { name: /Download JSON/ })
      await user.click(downloadButton)

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)

      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify(mock.ummMetadata),
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

      const moreActionsButton = await screen.findByText(/More Actions/)

      await user.click(moreActionsButton)

      const manageCollectionAssociationBtn = screen.getByRole('link', { name: 'Collection Associations' })
      expect(manageCollectionAssociationBtn.href).toBe('http://localhost:3000/tools/T1000000-MMT/collection-association')
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

        const editButton = await screen.findByRole('button', { name: /Edit/ })
        await user.click(editButton)

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

      const viewLatestPublishedRevision = await screen.findByRole('button', { name: 'Click here to view the latest published revision' })
      await user.click(viewLatestPublishedRevision)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT')
    })
  })

  describe('when called from /type/conceptId/revisions/revisionId', () => {
    test('renders Revisions button with revisions count and the navigates to correct page', async () => {
      const { user } = setup({
        overrideInitialEntries: ['/tools/T1000000-MMT/revisions/1'],
        overridePathValue: ':conceptId/revisions/:revisionId',
        overrideProps: {
          isRevision: true
        }
      })

      const moreActionsButton = await screen.findByText(/More Actions/)

      await user.click(moreActionsButton)

      const revisionsButton = screen.getByRole('link', { name: 'View Revisions 2' })
      expect(revisionsButton).toHaveAttribute('href', '/tools/T1000000-MMT/revisions')
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
                    conceptId: 'C1000000-MMT'
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        const tagBtn = screen.getByRole('button', { name: 'View Tags 1' })
        await user.click(tagBtn)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).getByText('1 tag')).toBeInTheDocument()
        expect(within(modal).getByText('Tag Key:')).toBeInTheDocument()
        expect(within(modal).getByText('Description:')).toBeInTheDocument()
        expect(within(modal).getByText('Mock tag description')).toBeInTheDocument()

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
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesOrServicesOrCitationsCollection
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        const tagBtn = screen.getByRole('button', { name: 'View Tags 0' })
        await user.click(tagBtn)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).getByText('There are no tags associated with this collection')).toBeInTheDocument()
      })
    })
  })

  describe('Granules', () => {
    describe('when the collection has granules', () => {
      test('should display the granule count', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT'
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Granules 1' }))
      })
    })

    describe('when clicking on View Granules', () => {
      test('should navigate to granules page', async () => {
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
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: publishCollectionRecord
                }
              }
            }
          ]
        })

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const viewGranulesButton = screen.getByRole('button', { name: 'View Granules 1' })
        await user.click(viewGranulesButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/collections/C1000000-MMT/granules')
      })
    })

    describe('when the collection has no granules', () => {
      test('should display the granule count with 0', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesOrServicesOrCitationsCollection
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Granules 0' }))

        const viewGranulesButton = screen.getByRole('button', { name: 'View Granules 0' })
        expect(viewGranulesButton).toBeInTheDocument()
        expect(viewGranulesButton).toHaveClass('disabled')
      })
    })
  })

  describe('Services', () => {
    describe('when the collection has services', () => {
      test('should display navigation link with service count', async () => {
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
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: publishCollectionRecord
                }
              }
            }
          ]
        })

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        const viewServicesButton = screen.getByRole('button', { name: 'View Services 1' })

        await user.click(viewServicesButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/collections/C1000000-MMT/service-associations')
      })
    })

    describe('when the collection has no services', () => {
      test('should display the services count with 0', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesOrServicesOrCitationsCollection
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Services 0' }))
      })
    })
  })

  describe('Citations', () => {
    describe('when the collection has citations', () => {
      test('should display navigation link with citation count', async () => {
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
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: publishCollectionRecord
                }
              }
            }
          ]
        })

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        const viewCitationsButton = screen.getByRole('button', { name: 'View Citations 1' })

        await user.click(viewCitationsButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/collections/C1000000-MMT/citation-associations')
      })
    })

    describe('when the collection has no citations', () => {
      test('should display the citation count with 0', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/collections/C1000000-MMT/1'],
          overridePath: '/collections',
          overrideMocks: [
            {
              request: {
                query: conceptTypeQueries.Collection,

                variables: {
                  params: {
                    conceptId: 'C1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  collection: noTagsOrGranulesOrServicesOrCitationsCollection
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

        const moreActionsButton = await screen.findByText(/More Actions/)

        await user.click(moreActionsButton)

        expect(screen.getByRole('button', { name: 'View Citations 0' }))
      })
    })
  })

  describe('Stage to UAT', () => {
    const collectionSetup = ({ overrideMocks, overrideProps } = {}) => setup({
      overrideInitialEntries: ['/collections/C1000000-MMT/1'],
      overridePath: '/collections',
      overrideProps,
      overrideMocks: overrideMocks || [
        {
          request: {
            query: conceptTypeQueries.Collection,
            variables: {
              params: {
                conceptId: 'C1000000-MMT'
              }
            }
          },
          result: {
            data: {
              collection: publishCollectionRecord
            }
          }
        }
      ]
    })

    describe('when viewing an older revision of the collection', () => {
      test('does not render the Stage to UAT button', async () => {
        const { user } = collectionSetup({ overrideProps: { isRevision: true } })

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        expect(screen.queryByRole('button', { name: 'Stage to UAT' })).not.toBeInTheDocument()
      })
    })

    describe('when clicking the Stage to UAT button', () => {
      test('shows the confirmation modal explaining what staging does', async () => {
        const { user } = collectionSetup()

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        expect(screen.getByText('Nothing is published to UAT by this action')).toBeInTheDocument()
        expect(screen.getByText(/Only collection metadata is copied/)).toBeInTheDocument()
        expect(screen.getByText('Staged metadata is retained for 30 days')).toBeInTheDocument()
      })
    })

    describe('when clicking No in the confirmation modal', () => {
      test('closes the modal without staging the concept', async () => {
        const { user } = collectionSetup()

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(stageConceptForProduction).toHaveBeenCalledTimes(0)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when staging is in progress', () => {
      test('ignores an Escape key dismissal until the request settles', async () => {
        let resolveStaging
        stageConceptForProduction.mockReturnValue(new Promise((resolve) => {
          resolveStaging = resolve
        }))

        const { user } = collectionSetup()

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        // The request is still pending, so the modal should ignore an Escape
        // key press (and, by the same guard, a backdrop click) rather than closing
        await user.keyboard('{Escape}')

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()

        resolveStaging({
          stagedConceptLink: 'http://prod.example.com/collections/staged/mock-record-id'
        })

        expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument()
      })
    })

    describe('when clicking Yes in the confirmation modal', () => {
      test('stages the concept and shows a copyable success link', async () => {
        stageConceptForProduction.mockResolvedValue({
          stagedConceptLink: 'http://prod.example.com/collections/staged/mock-record-id'
        })

        const { user } = collectionSetup()

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(stageConceptForProduction).toHaveBeenCalledTimes(1)
        expect(stageConceptForProduction).toHaveBeenCalledWith(
          'MMT_2',
          'mock-jwt',
          'collections',
          publishCollectionRecord.ummMetadata
        )

        expect(await screen.findByText('http://prod.example.com/collections/staged/mock-record-id')).toBeInTheDocument()
        expect(screen.getByText(/Do not lose this link/)).toBeInTheDocument()
      })
    })

    describe('when clicking Copy Link', () => {
      let user

      beforeEach(async () => {
        stageConceptForProduction.mockResolvedValue({
          stagedConceptLink: 'http://prod.example.com/collections/staged/mock-record-id'
        })

        user = collectionSetup().user

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(await screen.findByText('http://prod.example.com/collections/staged/mock-record-id')).toBeInTheDocument()
      })

      test('copies the link to the clipboard', async () => {
        const writeText = vi.fn().mockResolvedValue()
        Object.defineProperty(navigator, 'clipboard', {
          value: { writeText },
          configurable: true
        })

        const copyButton = screen.getByRole('button', { name: 'Copy Link' })
        await user.click(copyButton)

        await waitFor(() => {
          expect(writeText).toHaveBeenCalledWith('http://prod.example.com/collections/staged/mock-record-id')
        })
      })

      describe('when clicking Copy Link results in an error', () => {
        test('shows an error notification and calls errorLogger', async () => {
          const writeText = vi.fn().mockRejectedValue(new Error('Clipboard write denied'))
          Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true
          })

          const copyButton = screen.getByRole('button', { name: 'Copy Link' })
          await user.click(copyButton)

          await waitFor(() => {
            expect(errorLogger).toHaveBeenCalledWith(new Error('Clipboard write denied'), 'PublishPreview: handleCopyStagedConceptLink')
          })
        })
      })
    })

    describe('when staging the concept results in an error', () => {
      test('shows an error message and calls errorLogger', async () => {
        stageConceptForProduction.mockRejectedValue(new Error('An error occurred'))

        const { user } = collectionSetup()

        const moreActionsButton = await screen.findByText(/More Actions/)
        await user.click(moreActionsButton)

        const stageButton = screen.getByRole('button', { name: 'Stage to UAT' })
        await user.click(stageButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(await screen.findByText('An error occurred')).toBeInTheDocument()
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'PublishPreview: stageConceptForProduction')

        const closeButton = screen.getByRole('button', { name: 'Close' })
        await user.click(closeButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
