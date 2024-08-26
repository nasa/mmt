import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
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

import { DELETE_TOOL } from '@/js/operations/mutations/deleteTool'
import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'
import { GET_TOOLS } from '@/js/operations/queries/getTools'
import { GET_COLLECTION_REVISIONS } from '@/js/operations/queries/getCollectionRevisions'

import PublishPreview from '../PublishPreview'
import {
  collectionRecordWithRevisions,
  noTagsOrGranulesOrServicesCollection,
  publishCollectionRecord,
  publishedVariableRecord,
  recordWithRevisions,
  variableRecordWithRevisions
} from './__mocks__/publishPreview'

vi.mock('@/js/utils/constructDownloadableFile')
vi.mock('@/js/components/MetadataPreview/MetadataPreview')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

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
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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

      await user.click(revisionsButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT/revisions', { replace: false })
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
                  collection: noTagsOrGranulesOrServicesCollection
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
                  collection: noTagsOrGranulesOrServicesCollection
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
      })
    })
  })

  describe('Services', () => {
    describe('when the collection has services', () => {
      test('should display the service count', async () => {
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

        expect(screen.getByRole('button', { name: 'View Services 1' }))
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
                  collection: noTagsOrGranulesOrServicesCollection
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
})
