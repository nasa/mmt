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

import ummTSchema from '../../../schemas/umm/ummTSchema'
import toolsConfiguration from '../../../schemas/uiForms/toolsConfiguration'

import { DELETE_DRAFT } from '../../../operations/mutations/deleteDraft'

import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'

import errorLogger from '../../../utils/errorLogger'
import createTemplate from '../../../utils/createTemplate'

import DraftPreview from '../DraftPreview'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'
import Providers from '../../../providers/Providers/Providers'
import { PUBLISH_DRAFT } from '../../../operations/mutations/publishDraft'

vi.mock('../../../utils/createTemplate')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../PreviewProgress/PreviewProgress')
vi.mock('../../../utils/errorLogger')

global.fetch = vi.fn()

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

const mockDraft = {
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  deleted: false,
  name: null,
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata: {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      Name: 'UMM-T',
      Version: '1.1'
    },
    LongName: 'Long Name'
  },
  previewMetadata: {
    accessConstraints: null,
    ancillaryKeywords: null,
    associationDetails: null,
    conceptId: 'TD1000000-MMT',
    contactGroups: null,
    contactPersons: null,
    description: null,
    doi: null,
    nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
    lastUpdatedDate: null,
    longName: 'Long Name',
    metadataSpecification: {
      url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      name: 'UMM-T',
      version: '1.1'
    },
    name: null,
    organizations: null,
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
    versionDescription: null,
    __typename: 'Tool'
  },
  __typename: 'Draft'
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  pageUrl = '/drafts/tools/TD1000000-MMT',
  path = '/drafts/tools'
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

  render(
    <Providers>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route
              path={path}
            >
              <Route
                path=":conceptId"
                element={<DraftPreview />}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user: userEvent.setup()
  }
}

describe('DraftPreview', () => {
  test('renders the breadcrumbs', async () => {
    setup({})

    await waitForResponse()

    const breadcrumbs = screen.getByRole('navigation', { name: 'breadcrumb' })
    const breadcrumbOne = within(breadcrumbs).getByText('Tool Drafts')
    const breadcrumbTwo = within(breadcrumbs).getByText('<Blank Name>')

    expect(breadcrumbOne.href).toEqual('http://localhost:3000/drafts/tools')
    expect(breadcrumbTwo).toHaveClass('active')
  })

  test('renders a PreviewProgress component', async () => {
    setup({})

    await waitForResponse()

    expect(PreviewProgress).toHaveBeenCalledTimes(1)
    expect(PreviewProgress).toHaveBeenCalledWith({
      draftJson: {
        LongName: 'Long Name',
        MetadataSpecification: {
          Name: 'UMM-T',
          URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
          Version: '1.1'
        }
      },
      schema: ummTSchema,
      sections: toolsConfiguration,
      validationErrors: [{
        name: 'required',
        property: 'Name',
        message: "must have required property 'Name'",
        params: { missingProperty: 'Name' },
        stack: "must have required property 'Name'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'Type',
        message: "must have required property 'Type'",
        params: { missingProperty: 'Type' },
        stack: "must have required property 'Type'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'Version',
        message: "must have required property 'Version'",
        params: { missingProperty: 'Version' },
        stack: "must have required property 'Version'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'Description',
        message: "must have required property 'Description'",
        params: { missingProperty: 'Description' },
        stack: "must have required property 'Description'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'ToolKeywords',
        message: "must have required property 'ToolKeywords'",
        params: { missingProperty: 'ToolKeywords' },
        stack: "must have required property 'ToolKeywords'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'Organizations',
        message: "must have required property 'Organizations'",
        params: { missingProperty: 'Organizations' },
        stack: "must have required property 'Organizations'",
        schemaPath: '#/required'
      }, {
        name: 'required',
        property: 'URL',
        message: "must have required property 'URL'",
        params: { missingProperty: 'URL' },
        stack: "must have required property 'URL'",
        schemaPath: '#/required'
      }, {
        name: 'enum',
        property: '.MetadataSpecification.URL',
        message: 'must be equal to one of the allowed values',
        params: { allowedValues: ['https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0'] },
        stack: '.MetadataSpecification.URL must be equal to one of the allowed values',
        schemaPath: '#/definitions/MetadataSpecificationType/properties/URL/enum'
      }, {
        name: 'enum',
        property: '.MetadataSpecification.Version',
        message: 'must be equal to one of the allowed values',
        params: { allowedValues: ['1.2.0'] },
        stack: '.MetadataSpecification.Version must be equal to one of the allowed values',
        schemaPath: '#/definitions/MetadataSpecificationType/properties/Version/enum'
      }]
    }, {})
  })

  describe('when the request results in an error', () => {
    test('calls errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: conceptTypeDraftQueries.Tool,
              variables: {
                params: {
                  conceptId: 'TD1000000-MMT',
                  conceptType: 'Tool'
                }
              }
            },
            error: new Error('An error occurred')
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'DraftPreview: getDraft Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('when the draft could not be returned after 5', () => {
    test('calls errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [
          {
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
                draft: null
              }
            }
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Max retries allowed', 'DraftPreview: getDraft Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Draft could not be loaded.'
      }), {})
    })
  })

  describe('no draft could be loaded', () => {
    // Skipping because MockedProvider doesn't seem to be able to provide different results to the same query
    test.skip('calls getDraft again', async () => {
      setup([], [{
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
            draft: null
          }
        }
      }, {
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
      }])

      await waitForResponse()
      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the loaded draft is not the correct revisionId', () => {
    // Skipping because MockedProvider doesn't seem to be able to provide different results to the same query
    // Also don't know how to mock savedDraft effectively
    test.skip('calls getDraft again', async () => {
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
              draft: {
                ...mockDraft,
                // A previous revisionId from the savedDraft
                revisionId: '1'
              }
            }
          }
        }, {
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
        }]
      })

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when there is an error loading the draft', () => {
    test('displays an ErrorBanner', async () => {
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
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('when clicking the Delete button', () => {
    test('shows the DeleteDraftModal', async () => {
      const { user } = setup({})

      await waitForResponse()

      const button = screen.getByRole('button', { name: /Delete/ })
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

        await waitForResponse()

        const button = screen.getByRole('button', { name: /Delete/ })
        await user.click(button)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'DraftPreview: deleteDraftMutation')
      })
    })

    describe('when clicking the No button in the modal', () => {
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

        await waitForResponse()

        const button = screen.getByRole('button', { name: /Delete/ })
        await user.click(button)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        await waitForResponse()

        expect(screen.queryByText('Are you sure you want to delete this draft?')).not.toBeInTheDocument()

        expect(navigateSpy).toHaveBeenCalledTimes(0)
      })
    })

    describe('when clicking on Publish Draft button with no errors', () => {
      test('calls the publish mutation and navigates to the conceptId/revisionId page', async () => {
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

        await waitForResponse()

        const button = screen.getByRole('button', { name: /Publish/ })
        await user.click(button)
        await waitForResponse()
        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/tools/T1000000-MMT/2')
      })
    })

    describe('when clicking on Publish Draft button with errors', () => {
      test('calls the publish mutation and returns errors', async () => {
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
            error: new Error('#: required key [Name] not found,#: required key [LongName] not found')
          }]
        })

        await waitForResponse()

        const button = screen.getByRole('button', { name: /Publish/ })
        await user.click(button)
        await waitForResponse()
        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('#: required key [Name] not found,#: required key [LongName] not found', 'PublishMutation: publishMutation')
      })
    })

    describe('Variable Draft Publish', () => {
      describe('when clicking the publish button', () => {
        test('publishes the draft', async () => {
          const navigateSpy = vi.fn()
          vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

          const { user } = setup({
            pageUrl: '/drafts/variables/VD1200000-MMT',
            path: 'drafts/variables',
            overrideMocks: [
              {
                request: {
                  query: conceptTypeDraftQueries.Variable,
                  variables: {
                    params: {
                      conceptId: 'VD1200000-MMT',
                      conceptType: 'Variable'
                    }
                  }
                },
                result: {
                  data: {
                    draft: {
                      conceptId: 'VD1200000-MMT',
                      conceptType: 'variable-draft',
                      deleted: false,
                      name: 'Mock Variable',
                      nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
                      providerId: 'MMT_2',
                      revisionDate: '2024-02-15T16:57:09.667Z',
                      revisionId: '22',
                      ummMetadata: {
                        MetadataSpecification: {
                          URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
                          Name: 'UMM-Var',
                          Version: '1.9.0'
                        },
                        Definition: 'A sample variable record',
                        Name: 'Mock Variable',
                        LongName: 'A sample record',
                        VariableType: 'ANCILLARY_VARIABLE',
                        _private: {
                          CollectionAssociation: {
                            collectionConceptId: 'C1200000033-SEDAC',
                            shortName: 'CIESIN_SEDAC_ESI_2000',
                            version: '2000.00'
                          }
                        }
                      },
                      previewMetadata: {
                        additionalIdentifiers: null,
                        associationDetails: null,
                        conceptId: 'VD1200000-MMT',
                        dataType: null,
                        definition: 'A sample variable record',
                        dimensions: null,
                        fillValues: null,
                        indexRanges: null,
                        instanceInformation: null,
                        longName: 'A sample record',
                        measurementIdentifiers: null,
                        name: 'Demo Collection Association',
                        nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
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
              },
              {
                request: {
                  query: PUBLISH_DRAFT,
                  variables: {
                    draftConceptId: 'VD1200000-MMT',
                    nativeId: 'MMT_46e9d61a-10ab-4f53-890e-06c09c2dfc80',
                    collectionConceptId: 'C1200000033-SEDAC',
                    ummVersion: '1.9.0'
                  }
                },
                result: {
                  data: {
                    publishDraft: {
                      conceptId: 'V1000000-MMT',
                      revisionId: '2'
                    }
                  }
                }
              }
            ]
          })

          await waitForResponse()

          const button = screen.getByRole('button', { name: /Publish/ })
          await user.click(button)
          await waitForResponse()
          expect(navigateSpy).toHaveBeenCalledTimes(1)
          expect(navigateSpy).toHaveBeenCalledWith('/variables/V1000000-MMT/2')
        })
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
    describe('when click on save as template results in a success', () => {
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
          path: 'drafts/collections'

        })

        await waitForResponse()
        const button = screen.getByRole('button', { name: /Save as Template/ })
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
          path: 'drafts/collections'

        })

        await waitForResponse()
        const button = screen.getByRole('button', { name: /Save as Template/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error creating template', 'DraftPreview: handleTemplate')
      })
    })
  })
})
