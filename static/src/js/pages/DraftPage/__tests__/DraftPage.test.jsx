import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'

import { DELETE_DRAFT } from '@/js/operations/mutations/deleteDraft'
import { PUBLISH_DRAFT } from '@/js/operations/mutations/publishDraft'
import { GraphQLError } from 'graphql'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

import errorLogger from '@/js/utils/errorLogger'
import createTemplate from '@/js/utils/createTemplate'

import Providers from '@/js/providers/Providers/Providers'
import DraftPage from '@/js/pages/DraftPage/DraftPage'

vi.mock('@/js/components/MetadataPreview/MetadataPreview')
vi.mock('@/js/utils/createTemplate')
vi.mock('@/js/utils/errorLogger')

const ummMetadata = {
  Description: 'Mock Description',
  LongName: 'Long Name',
  MetadataSpecification: {
    Name: 'UMM-T',
    URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    Version: '1.2.0'
  },
  Name: 'Mock Name',
  Organizations: [{
    LongName: 'CLIVAR and Carbon Hydrographic Data Office',
    Roles: ['SERVICE PROVIDER'],
    ShortName: 'CLIVAR/CCHDO',
    URLValue: 'http://www.bodc.ac.uk/'
  }],
  ToolKeywords: [{
    ToolCategory: 'EARTH SCIENCE SERVICES',
    ToolSpecificTerm: 'MODEL LOGS',
    ToolTerm: 'ANCILLARY MODELS',
    ToolTopic: 'MODELS'
  }],
  Type: 'Model',
  URL: {
    Subtype: 'MOBILE APP',
    Type: 'DOWNLOAD SOFTWARE',
    URLContentType: 'DistributionURL',
    URLValue: 'mock url'
  },
  Version: 'Mock Version'
}

const mockDraft = {
  __typename: 'Draft',
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  deleted: false,
  name: 'mock name',
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  previewMetadata: {
    __typename: 'Tool',
    accessConstraints: null,
    ancillaryKeywords: null,
    associationDetails: null,
    conceptId: 'TD1000000-MMT',
    contactGroups: null,
    contactPersons: null,
    description: null,
    doi: null,
    lastUpdatedDate: null,
    longName: 'Long Name',
    metadataSpecification: {
      name: 'UMM-T',
      url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      version: '1.1'
    },
    name: null,
    nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
    organizations: null,
    pageTitle: null,
    potentialAction: null,
    quality: null,
    relatedUrls: null,
    revisionId: '2',
    searchAction: null,
    supportedBrowsers: null,
    supportedInputFormats: null,
    supportedOperatingSystems: null,
    supportedOutputFormats: null,
    supportedSoftwareLanguages: null,
    toolKeywords: null,
    type: null,
    url: null,
    useConstraints: null,
    version: null,
    versionDescription: null
  },
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata
}

const mockCollectionDraft = {
  __typename: 'Draft',
  conceptId: 'CD1000000-MMT',
  conceptType: 'collection-draft',
  deleted: false,
  name: 'mock name',
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  previewMetadata: {
    __typename: 'Collection',
    accessConstraints: null,
    ancillaryKeywords: null,
    associationDetails: null,
    conceptId: 'CD1000000-MMT',
    contactGroups: null,
    contactPersons: null,
    description: null,
    doi: null,
    lastUpdatedDate: null,
    longName: 'Long Name',
    metadataSpecification: {
      name: 'UMM-C',
      url: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.1',
      version: '1.1'
    },
    name: null,
    nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
    organizations: null,
    pageTitle: null,
    potentialAction: null,
    quality: null,
    relatedUrls: null,
    revisionId: '2',
    searchAction: null,
    supportedBrowsers: null,
    supportedInputFormats: null,
    supportedOperatingSystems: null,
    supportedOutputFormats: null,
    supportedSoftwareLanguages: null,
    toolKeywords: null,
    type: null,
    url: null,
    useConstraints: null,
    version: null,
    versionDescription: null
  },
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  pageUrl = '/drafts/tools/TD1000000-MMT',
  overridePageUrl = false,
  path = '/drafts/:draftType/:conceptId',
  overridePath = false
}) => {
  const mocks = [{
    request: {
      query: conceptTypeDraftQueries.Tool,
      variables: {
        params: {
          conceptId: 'TD1000000-MMT',
          conceptType: 'Tool'
        }
      }
    },
    result: {
      data: {
        draft: mockDraft
      }
    }
  }, ...additionalMocks]

  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={[overridePageUrl || pageUrl]}>
          <Routes>
            <Route
              path={overridePath || path}
              element={<DraftPage />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user
  }
}

describe('DraftPage', () => {
  test('renders the breadcrumbs', async () => {
    setup({})

    const breadcrumbs = await screen.findByRole('navigation', { name: 'breadcrumb' })
    const breadcrumbOne = within(breadcrumbs).getByText('Tool Drafts')
    const breadcrumbTwo = within(breadcrumbs).getByText('<Blank Name>')

    expect(breadcrumbOne.href).toEqual('http://localhost:3000/drafts/tools')
    expect(breadcrumbTwo).toHaveClass('active')
  })

  test('renders the provider id in a badge', async () => {
    setup({})

    expect(await screen.findByText('MMT_2')).toBeInTheDocument()
    expect(screen.getByText('MMT_2')).toHaveClass('badge')
  })

  describe('when clicking the Delete button', () => {
    test('shows the DeleteDraftModal', async () => {
      const { user } = setup({})

      const button = await screen.findByRole('button', { name: /Delete/ })
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete this draft?')).toBeInTheDocument()
    })

    describe('when clicking the Yes button in the modal', () => {
      test('calls the deleteDraft mutation and navigates to the manage/tools page', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2'
              }
            },
            result: {
              data: {
                deleteDraft: {
                  conceptId: 'TD1000000-MMT',
                  revisionId: '2'
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
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools')
      })
    })

    describe('when clicking the Yes button in the modal results in an error', () => {
      test('calls addNotification and errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
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
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'DraftPreview: deleteDraftMutation')
      })
    })

    describe('when clicking the No button in the modal', () => {
      test('does not navigate and hides the modal', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2'
              }
            },
            result: {
              data: {
                deleteDraft: {
                  conceptId: 'TD1000000-MMT',
                  revisionId: '2'
                }
              }
            }
          }]
        })

        const button = await screen.findByRole('button', { name: /Delete/ })
        await user.click(button)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.queryByText('Are you sure you want to delete this draft?')).not.toBeInTheDocument()

        expect(navigateSpy).toHaveBeenCalledTimes(0)
      })
    })

    describe('when clicking on Publish Draft button', () => {
      test('is enabled if draft has no errors', async () => {
        const { user } = setup({})

        const button = await screen.findByRole('button', { name: /Publish/ })
        await user.click(button)
        expect(button).not.toHaveAttribute('disabled')
      })

      test('is disabled if draft has errors', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        // Overriding ummMetadata and setting Name to a number to make it fail validation.
        const invalidMockDraft = {
          ...mockDraft,
          ummMetadata: {
            ...ummMetadata,
            Name: 1
          }
        }

        setup({
          overrideMocks: [{
            request: {
              query: conceptTypeDraftQueries.Tool,
              variables: {
                params: {
                  conceptId: 'TD1000000-MMT',
                  conceptType: 'Tool'
                }
              }
            },
            result: {
              data: {
                draft: invalidMockDraft
              }
            }
          }]
        })

        const button = await screen.findByRole('button', { name: /Publish/ })
        expect(button).toHaveAttribute('disabled')
      })

      test('buttons are disabled if draft does not exist', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        // Overriding ummMetadata and setting it to have errors
        const invalidMockDraft = {
          ...mockCollectionDraft,
          ummMetadata: {
            errors: 'concept not found in DB'
          }
        }

        setup({
          overrideMocks: [{
            request: {
              query: conceptTypeDraftQueries.Collection,
              variables: {
                params: {
                  conceptId: 'CD1000000-MMT',
                  conceptType: 'Collection'
                }
              }
            },
            result: {
              data: {
                draft: invalidMockDraft
              }
            }
          }],
          overridePageUrl: '/drafts/collections/CD1000000-MMT',
          overridePath: '/drafts/:draftType/:conceptId'
        })

        const publishButton = await screen.findByRole('button', { name: /Publish/ })
        expect(publishButton).toHaveAttribute('disabled')

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        expect(deleteButton).toHaveAttribute('disabled')

        const templateButton = await screen.findByRole('button', { name: /Save as Template/ })
        expect(templateButton).toHaveAttribute('disabled')
      })

      test('calls the publish mutation and if unsuccesfull shows error', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: PUBLISH_DRAFT,
              variables: {
                draftConceptId: 'TD1000000-MMT',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                ummVersion: '1.2.0'
              }
            },
            result: {
              errors: [new GraphQLError('An error occurred')]
            }
          }]
        })

        const button = await screen.findByRole('button', { name: /Publish/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('An error occurred', 'PublishMutation: publishMutation')
      })

      test('calls the publish mutation and navigates to the concept page', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: PUBLISH_DRAFT,
              variables: {
                draftConceptId: 'TD1000000-MMT',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                ummVersion: '1.2.0'
              }
            },
            result: {
              data: {
                publishDraft: {
                  conceptId: 'T1000000-MMT',
                  revisionId: '2'
                }
              }
            }
          }]
        })

        const button = await screen.findByRole('button', { name: /Publish/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT')
      })
    })
  })

  describe('when the draft type is collection', () => {
    const collectionDraft = {
      conceptId: 'CD1200000161-MMT_2',
      conceptType: 'collection-draft',
      deleted: false,
      name: null,
      nativeId: 'MMT_ec79d22d-b918-491a-b097-b56a71532baa',
      providerId: 'MMT_2',
      revisionDate: '2024-04-12T15:30:44.245Z',
      revisionId: '2',
      ummMetadata: {
        MetadataSpecification: {
          URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2',
          Name: 'UMM-C',
          Version: '1.17.2'
        },
        ShortName: 'Collection Draft Test',
        DataDates: null
      },
      previewMetadata: {
        abstract: null,
        accessConstraints: null,
        additionalAttributes: null,
        associationDetails: null,
        associatedDois: null,
        archiveCenter: null,
        ancillaryKeywords: null,
        archiveAndDistributionInformation: null,
        boxes: null,
        browseFlag: null,
        cloudHosted: null,
        conceptId: 'CD1200000-MMT_2',
        consortiums: null,
        collectionCitations: null,
        collectionDataType: null,
        collectionProgress: null,
        contactGroups: null,
        contactPersons: null,
        coordinateSystem: null,
        dataCenter: null,
        dataCenters: null,
        dataDates: [
          {
            type: 'CREATE'
          }
        ],
        dataLanguage: null,
        directDistributionInformation: null,
        directoryNames: null,
        doi: null,
        datasetId: null,
        nativeDataFormats: null,
        hasFormats: null,
        hasGranules: null,
        hasSpatialSubsetting: null,
        hasTemporalSubsetting: null,
        hasTransforms: null,
        hasVariables: null,
        isoTopicCategories: null,
        metadataAssociations: null,
        metadataDates: null,
        metadataLanguage: null,
        metadataFormat: null,
        onlineAccessFlag: null,
        organizations: null,
        originalFormat: null,
        lines: null,
        locationKeywords: null,
        pageTitle: null,
        paleoTemporalCoverages: null,
        platforms: null,
        points: null,
        polygons: null,
        projects: null,
        provider: null,
        publicationReferences: null,
        quality: null,
        nativeId: 'MMT_ec79d22d-b918-491a-b097-b56a71532baa',
        processingLevel: null,
        processingLevelId: null,
        purpose: null,
        revisionDate: '2024-04-12T15:30:44.245Z',
        revisionId: '2',
        relatedUrls: null,
        scienceKeywords: null,
        shortName: 'Collection Draft Test',
        spatialExtent: null,
        spatialInformation: null,
        standardProduct: null,
        summary: null,
        tags: null,
        temporalExtents: null,
        temporalKeywords: null,
        tilingIdentificationSystems: null,
        timeStart: null,
        timeEnd: null,
        title: null,
        useConstraints: null,
        versionDescription: null,
        versionId: null,
        version: null,
        __typename: 'Collection'
      },
      __typename: 'Draft'
    }

    describe('when a click on save as template results in a success', () => {
      test('should navigate to /templates', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        createTemplate.mockReturnValue({ id: '1234-abcd-5678-efgh' })

        const { user } = setup({
          overrideMocks: [
            {
              request: {
                query: conceptTypeDraftQueries.Collection,
                variables: {
                  params: {
                    conceptId: 'CD1200000-MMT',
                    conceptType: 'Collection'
                  }
                }
              },
              result: {
                data: {
                  draft: collectionDraft
                }
              }
            }
          ],
          pageUrl: '/drafts/collections/CD1200000-MMT',
          path: '/drafts/:draftType/:conceptId'

        })

        const button = await screen.findByRole('button', { name: /Save as Template/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collection/1234-abcd-5678-efgh')
      })
    })

    describe('when click on save as template results in a failure', () => {
      test('should navigate to /templates', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        createTemplate.mockReturnValue({})

        const { user } = setup({
          overrideMocks: [
            {
              request: {
                query: conceptTypeDraftQueries.Collection,
                variables: {
                  params: {
                    conceptId: 'CD1200000-MMT',
                    conceptType: 'Collection'
                  }
                }
              },
              result: {
                data: {
                  draft: collectionDraft
                }
              }
            }
          ],
          pageUrl: '/drafts/collections/CD1200000-MMT',
          path: '/drafts/:draftType/:conceptId'

        })

        const button = await screen.findByRole('button', { name: /Save as Template/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error creating template', 'DraftPreview: handleTemplate')
      })
    })
  })
})
