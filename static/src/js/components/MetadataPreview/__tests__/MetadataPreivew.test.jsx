import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import MetadataPreview from '../MetadataPreview'
import Providers from '../../../providers/Providers/Providers'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'
import conceptTypeQueries from '../../../constants/conceptTypeQueries'
import {
  mockCollection,
  mockCollectionDraft,
  mockServiceDraft,
  mockToolDraft,
  mockVariableDraft
} from './__mocks__/MatadataPreviewMocks'

vi.mock('@edsc/metadata-preview')

const setup = ({
  initialEntries,
  mock,
  overrideRoute = false,
  overridePath = false,
  overrideProps = {}
}) => {
  const props = {
    conceptId: '',
    conceptType: '',
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider mocks={mock}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Routes>
            <Route
              path={overridePath || '/drafts'}
            >
              <Route
                path={overrideRoute || ':draftType/:conceptId'}
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <MetadataPreview {...props} />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    props,
    user
  }
}

describe('MetadataPreview', () => {
  describe('when the conceptType is Tool draft', () => {
    test('renders a ToolPreview component', async () => {
      setup({
        overrideProps: {
          conceptId: 'TD000000-MMT',
          conceptType: 'Tool'
        },
        mock: [{
          request: {
            query: conceptTypeDraftQueries.Tool,
            variables: {
              params: {
                conceptId: 'TD000000-MMT',
                conceptType: 'Tool'
              }
            }
          },
          result: {
            data: {
              draft: mockToolDraft
            }
          }
        }],
        initialEntries: '/drafts/tools/T1000000-MMT'
      })

      await waitFor(() => {
        expect(ToolPreview).toHaveBeenCalledWith({
          conceptId: 'TD000000-MMT',
          conceptType: 'tool',
          conceptUrlTemplate: '/{conceptType}/{conceptId}',
          isPlugin: true,
          tool: {
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
          }
        }, {})
      })

      expect(ToolPreview).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the conceptType is Service draft', () => {
    test('renders a Service Preview component', async () => {
      setup({
        overrideProps: {
          conceptId: 'SD000000-MMT',
          conceptType: 'Service'
        },
        mock: [{
          request: {
            query: conceptTypeDraftQueries.Service,
            variables: {
              params: {
                conceptId: 'SD000000-MMT',
                conceptType: 'Service'
              }
            }
          },
          result: {
            data: {
              draft: mockServiceDraft
            }
          }
        }],
        initialEntries: '/drafts/services/S1000000-MMT'

      })

      await waitFor(() => {
        expect(ServicePreview).toHaveBeenCalledWith({
          conceptId: 'SD000000-MMT',
          conceptType: 'service',
          conceptUrlTemplate: '/{conceptType}/{conceptId}',
          isPlugin: true,
          service: {
            __typename: 'Service',
            accessConstraints: null,
            ancillaryKeywords: null,
            associationDetails: null,
            conceptId: 'SD000000-MMT',
            contactGroups: null,
            contactPersons: null,
            description: null,
            lastUpdatedDate: null,
            longName: 'Test long name',
            maxItemsPerOrder: null,
            name: 'Service Draft Preview Test',
            nativeId: 'MMT_88f3c72f-38df-4524-b97c-dce0c8d0b3e7',
            operationMetadata: null,
            pageTitle: 'Service Draft Preview Test',
            providerId: 'MMT_2',
            relatedUrls: null,
            serviceKeywords: null,
            serviceOptions: null,
            serviceOrganizations: null,
            serviceQuality: null,
            supportedInputProjections: null,
            supportedOutputProjections: null,
            supportedReformattings: null,
            type: null,
            url: null,
            useConstraints: null,
            version: 'v.1.0.0',
            versionDescription: null
          }
        }, {})
      })

      expect(ServicePreview).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the conceptType is Variable draft', () => {
    test('renders a Variable Preview component', async () => {
      setup({
        overrideProps: {
          conceptId: 'VD000000-MMT',
          conceptType: 'Variable'
        },
        mock: [{
          request: {
            query: conceptTypeDraftQueries.Variable,
            variables: {
              params: {
                conceptId: 'VD000000-MMT',
                conceptType: 'Variable'
              }
            }
          },
          result: {
            data: {
              draft: mockVariableDraft
            }
          }
        }],
        initialEntries: '/drafts/services/V1000000-MMT'

      })

      await waitFor(() => {
        expect(VariablePreview).toHaveBeenCalledWith({
          conceptId: 'VD000000-MMT',
          conceptType: 'variable',
          conceptUrlTemplate: '/{conceptType}/{conceptId}',
          isPlugin: true,
          variable: {
            __typename: 'Variable',
            additionalIdentifiers: [
              {
                identifier: '213'
              }
            ],
            associationDetails: null,
            conceptId: 'VD1200000101-MMT_2',
            dataType: null,
            definition: 'asdf',
            dimensions: null,
            fillValues: null,
            indexRanges: null,
            instanceInformation: null,
            longName: '12',
            measurementIdentifiers: null,
            name: 'Testing a Variable association',
            nativeId: 'MMT_f1a16a66-bc9c-4ba9-bd38-825276522f9e',
            offset: null,
            pageTitle: 'Testing a Variable association',
            relatedUrls: null,
            samplingIdentifiers: null,
            scale: null,
            scienceKeywords: null,
            sets: null,
            standardName: null,
            units: null,
            validRanges: null,
            variableSubType: null,
            variableType: null
          }
        }, {})
      })

      expect(VariablePreview).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the conceptType is Collection draft', () => {
    test('renders a Collection Preview component', async () => {
      setup({
        overrideProps: {
          conceptId: 'CD000000-MMT',
          conceptType: 'Collection'
        },
        mock: [{
          request: {
            query: conceptTypeDraftQueries.Collection,
            variables: {
              params: {
                conceptId: 'CD000000-MMT',
                conceptType: 'Collection'
              }
            }
          },
          result: {
            data: {
              draft: mockCollectionDraft
            }
          }
        }],
        initialEntries: '/drafts/collections/CD1000000-MMT'
      })

      await waitFor(() => {
        expect(CollectionPreview).toHaveBeenCalledWith({
          cmrHost: 'https://cmr.earthdata.nasa.gov',
          conceptId: 'CD000000-MMT',
          conceptType: 'collection',
          conceptUrlTemplate: '/{conceptType}/{conceptId}',
          isPlugin: true,
          collection: {
            __typename: 'Collection',
            abstract: null,
            accessConstraints: null,
            additionalAttributes: null,
            ancillaryKeywords: null,
            archiveAndDistributionInformation: null,
            archiveCenter: null,
            associatedDois: null,
            associationDetails: null,
            boxes: null,
            browseFlag: null,
            cloudHosted: null,
            collectionCitations: null,
            collectionDataType: null,
            collectionProgress: null,
            conceptId: 'CD1200000116-MMT_2',
            consortiums: null,
            contactGroups: null,
            contactPersons: null,
            coordinateSystem: null,
            dataCenter: null,
            dataCenters: null,
            dataDates: null,
            dataLanguage: null,
            datasetId: null,
            directDistributionInformation: null,
            directoryNames: null,
            doi: null,
            hasFormats: null,
            hasGranules: null,
            hasSpatialSubsetting: null,
            hasTemporalSubsetting: null,
            hasTransforms: null,
            hasVariables: null,
            isoTopicCategories: null,
            lines: null,
            locationKeywords: null,
            metadataAssociations: null,
            metadataDates: null,
            metadataFormat: null,
            metadataLanguage: null,
            nativeDataFormats: null,
            nativeId: 'MMT_ae383e10-4d28-4f2e-be56-5721573db3dd',
            onlineAccessFlag: null,
            organizations: null,
            originalFormat: null,
            pageTitle: 'Testing Collection Preview',
            paleoTemporalCoverages: null,
            platforms: null,
            points: null,
            polygons: null,
            processingLevel: null,
            processingLevelId: null,
            projects: null,
            provider: null,
            publicationReferences: null,
            purpose: null,
            quality: null,
            relatedUrls: null,
            revisionDate: '2024-04-29T21:12:09.999Z',
            revisionId: '1',
            scienceKeywords: null,
            shortName: 'Testing Collection Preview',
            spatialExtent: null,
            spatialInformation: null,
            standardProduct: null,
            summary: null,
            tags: null,
            temporalExtents: null,
            temporalKeywords: null,
            tilingIdentificationSystems: null,
            timeEnd: null,
            timeStart: null,
            title: null,
            useConstraints: null,
            version: 'v.1.0.0',
            versionDescription: null,
            versionId: null
          },
          token: null
        }, {})
      })

      expect(CollectionPreview).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the conceptType is Collection', () => {
    test('renders a Collection Preview component', async () => {
      setup({
        overrideProps: {
          conceptId: 'CD000000-MMT',
          conceptType: 'Collection'
        },
        mock: [{
          request: {
            query: conceptTypeQueries.Collection,
            variables: { params: { conceptId: 'CD000000-MMT' } }
          },
          result: {
            data: {
              collection: mockCollection
            }
          }
        }],
        initialEntries: '/CD1000000-MMT',
        overrideRoute: '/:conceptId',
        overridePath: '/'
      })

      await waitFor(() => {
        // TODO: what is this test testing? It seemed redundant but the paths are different
        expect(CollectionPreview).toHaveBeenCalledWith({})
      })

      expect(CollectionPreview).toHaveBeenCalledTimes(1)
    })
  })
})
