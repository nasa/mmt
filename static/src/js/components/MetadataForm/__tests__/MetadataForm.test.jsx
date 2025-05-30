import React, {
  Suspense,
  useEffect,
  useRef
} from 'react'
import {
  act,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import Form from '@rjsf/core'
import * as router from 'react-router'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

import errorLogger from '@/js/utils/errorLogger'
import getUmmVersion from '@/js/utils/getUmmVersion'

import relatedUrlsUiSchema from '@/js/schemas/uiSchemas/tools/relatedUrls'
import toolInformationUiSchema from '@/js/schemas/uiSchemas/tools/toolInformation'
import ummTSchema from '@/js/schemas/umm/ummTSchema'
import toolsConfiguration from '@/js/schemas/uiForms/toolsConfiguration'

import BoundingRectangleField from '@/js/components/BoundingRectangleField/BoundingRectangleField'
import CustomArrayFieldTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomCountrySelectWidget from '@/js/components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '@/js/components/CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomRadioWidget from '@/js/components/CustomRadioWidget/CustomRadioWidget'
import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '@/js/components/CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import FormNavigation from '@/js/components/FormNavigation/FormNavigation'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import JsonPreview from '@/js/components/JsonPreview/JsonPreview'
import KeywordPicker from '@/js/components/KeywordPicker/KeywordPicker'
import OneOfField from '@/js/components/OneOfField/OneOfField'
import StreetAddressField from '@/js/components/StreetAddressField/StreetAddressField'
import VisualizationLatency from '@/js/components/VisualizationLatency/VisualizationLatency'

import Providers from '@/js/providers/Providers/Providers'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'
import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'
import { PUBLISH_DRAFT } from '@/js/operations/mutations/publishDraft'

import MetadataForm from '../MetadataForm'

vi.mock('@/js/hooks/usePublishMutation', () => ({
  default: vi.fn(() => {
    const [publishDraft, setPublishDraft] = React.useState(null)
    const [error] = React.useState(null)

    const publishMutation = vi.fn(() => new Promise((resolve) => {
      setTimeout(() => {
        setPublishDraft({
          conceptId: 'T1000000-MMT',
          revisionId: '1'
        })

        resolve()
      }, 100)
    }))

    return {
      publishMutation,
      publishDraft,
      error
    }
  })
}))

vi.mock('@rjsf/core', () => ({
  default: vi.fn(({
    onChange,
    onBlur,
    formData,
    formContext = {}
  }) => {
    const { focusField } = formContext
    const shouldFocus = focusField === 'Name'
    const focusRef = useRef()

    useEffect(() => {
      // This useEffect for shouldFocus lets the refs be in place before trying to use them
      if (shouldFocus) {
        focusRef.current?.focus()
      }
    }, [shouldFocus])

    return (
      // This mock component renders a single input field for a 'Name' field. This allows the
      // tests that need to call onChange/onBlur to actually modify the state/context in MetadataForm
      <mock-Component data-testid="MockForm">
        <input
          id="ShortName"
          name="ShortName"
          aria-label="ShortName"
          type="text"
          onChange={
            (event) => {
              const { value } = event.target

              onChange({
                formData: {
                  ...formData,
                  ShortName: value
                }
              })
            }
          }
          onBlur={() => onBlur('mock-short-name')}
          value={formData.ShortName || ''}
        />

        <input
          id="EntryTitle"
          name="EntryTitle"
          aria-label="EntryTitle"
          type="text"
          onChange={
            (event) => {
              const { value } = event.target

              onChange({
                formData: {
                  ...formData,
                  EntryTitle: value
                }
              })
            }
          }
          onBlur={() => onBlur('mock-entry-title')}
          value={formData.EntryTitle || ''}
        />

        <input
          id="Name"
          name="Name"
          aria-label="Name"
          type="text"
          ref={focusRef}
          onChange={
            (event) => {
              const { value } = event.target

              onChange({
                formData: {
                  ...formData,
                  Name: value
                }
              })
            }
          }
          onBlur={() => onBlur('mock-name')}
          value={formData.Name || ''}
        />

      </mock-Component>
    )
  })
}))

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/components/JsonPreview/JsonPreview')
vi.mock('@/js/components/FormNavigation/FormNavigation')
vi.mock('@/js/utils/errorLogger')

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
    LongName: 'Long Name',
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      Name: 'UMM-T',
      Version: '1.1'
    }
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
    versionDescription: null,
    __typename: 'Tool'
  },
  __typename: 'Draft'
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  pageUrl = '/drafts/tools/TD1000000-MMT/tool-information'
}) => {
  const mocks = [{
    request: {
      query: GET_AVAILABLE_PROVIDERS,
      variables: {
        params: {
          limit: 500,
          // Don't have an easy way to get a real uid into the context here
          permittedUser: undefined,
          target: 'PROVIDER_CONTEXT'
        }
      }
    },
    result: {
      data: {
        acls: {
          items: [{
            conceptId: 'mock-id-1',
            providerIdentity: {
              provider_id: 'MMT_1'
            }
          }, {
            conceptId: 'mock-id-2',
            providerIdentity: {
              provider_id: 'MMT_2'
            }
          }]
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
  }, ...additionalMocks]

  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route
              path="/drafts/:draftType"
            >
              <Route
                element={
                  (
                    <Suspense>
                      <MetadataForm />
                    </Suspense>
                  )
                }
                path="new"
              />
              <Route
                path=":conceptId/:sectionName"
                element={
                  (
                    <Suspense>
                      <MetadataForm />
                    </Suspense>
                  )
                }
              />
              <Route
                path=":conceptId/:sectionName/:fieldName"
                element={
                  (
                    <Suspense>
                      <MetadataForm />
                    </Suspense>
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
    user
  }
}

describe('MetadataForm', () => {
  describe('when the concept type is a Tool draft', () => {
    describe('when on the related-urls form', () => {
      test('renders a Form component', async () => {
        setup({
          pageUrl: '/drafts/tools/TD1000000-MMT/related-urls'
        })

        await waitFor(() => {
          expect(Form).toHaveBeenCalledWith(expect.objectContaining({
            fields: {
              BoundingRectangle: BoundingRectangleField,
              OneOfField,
              VisualizationLatency,
              TitleField: CustomTitleField,
              keywordPicker: KeywordPicker,
              layout: GridLayout,
              streetAddresses: StreetAddressField
            },
            formData: {
              LongName: 'Long Name',
              MetadataSpecification: {
                Name: 'UMM-T',
                URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                Version: '1.1'
              }
            },
            schema: expect.objectContaining({
              properties: expect.objectContaining({
                RelatedURLs: {
                  description:
                  'A URL associated with the web user interface or downloadable tool, e.g., the home page for the tool provider which is responsible for the tool.',
                  type: 'array',
                  items: {
                    $ref: '#/definitions/RelatedURLType'
                  },
                  minItems: 0
                }
              })
            }),
            uiSchema: relatedUrlsUiSchema,
            templates: {
              ArrayFieldTemplate: CustomArrayFieldTemplate,
              FieldTemplate: CustomFieldTemplate,
              TitleFieldTemplate: CustomTitleFieldTemplate
            },
            widgets: {
              CheckboxWidget: CustomRadioWidget,
              CountrySelectWidget: CustomCountrySelectWidget,
              DateTimeWidget: CustomDateTimeWidget,
              RadioWidget: CustomRadioWidget,
              SelectWidget: CustomSelectWidget,
              TextWidget: CustomTextWidget,
              TextareaWidget: CustomTextareaWidget
            }
          }), {})
        })

        expect(Form).toHaveBeenCalledTimes(2)
      })
    })

    describe('when rendering a new draft form', () => {
      test('renders the Form component for the tool-information page', async () => {
        setup({
          overrideMocks: [],
          pageUrl: '/drafts/tools/new'
        })

        await waitFor(() => {
          expect(Form).toHaveBeenCalledTimes(2)
        })

        expect(Form).toHaveBeenCalledWith(expect.objectContaining({
          fields: {
            BoundingRectangle: BoundingRectangleField,
            OneOfField,
            VisualizationLatency,
            TitleField: CustomTitleField,
            keywordPicker: KeywordPicker,
            layout: GridLayout,
            streetAddresses: StreetAddressField
          },
          formData: {},
          schema: expect.objectContaining({
            properties: expect.objectContaining({
              Name: {
                description: 'The name of the downloadable tool or web user interface.',
                type: 'string',
                minLength: 1,
                maxLength: 85
              }
            })
          }),
          uiSchema: toolInformationUiSchema,
          templates: {
            ArrayFieldTemplate: CustomArrayFieldTemplate,
            FieldTemplate: CustomFieldTemplate,
            TitleFieldTemplate: CustomTitleFieldTemplate
          },
          widgets: {
            CheckboxWidget: CustomRadioWidget,
            CountrySelectWidget: CustomCountrySelectWidget,
            DateTimeWidget: CustomDateTimeWidget,
            RadioWidget: CustomRadioWidget,
            SelectWidget: CustomSelectWidget,
            TextWidget: CustomTextWidget,
            TextareaWidget: CustomTextareaWidget
          }
        }), {})
      })
    })

    test('renders a FormNavigation and JsonPreview component', async () => {
      setup({})

      await waitFor(() => {
        expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
          draft: {
            LongName: 'Long Name',
            MetadataSpecification: {
              URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
              Name: 'UMM-T',
              Version: '1.1'
            }
          },
          formSections: toolsConfiguration,
          loading: false,
          schema: ummTSchema,
          visitedFields: []
        }), {})
      })

      expect(FormNavigation).toHaveBeenCalledTimes(2)

      expect(JsonPreview).toHaveBeenCalledTimes(2)
    })
  })

  describe('when FormNavigation sends onCancel', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('@/js/components/FormNavigation/FormNavigation').default
      )
    })

    test('resets the form to the original values', async () => {
      const { user } = setup({})

      // Fill out a form field
      const nameField = await screen.findByRole('textbox', { name: 'Name' })
      await user.type(nameField, 'Test Name')
      await user.tab()

      expect(await screen.findByRole('textbox', {
        name: 'Name',
        value: 'Test Name'
      })).toBeInTheDocument()

      expect(FormNavigation).toHaveBeenCalledTimes(14)
      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: ['mock-name']
      }), {})

      vi.clearAllMocks()

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(await screen.findByRole('textbox', {
        name: 'Name',
        value: ''
      })).toBeInTheDocument()

      expect(FormNavigation).toHaveBeenCalledTimes(1)
      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: []
      }), {})
    })
  })

  describe('when FormNavigation sends onChange', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('@/js/components/FormNavigation/FormNavigation').default
      )
    })

    test('updates the draft context value', async () => {
      const { user } = setup({})

      // Fill out a form field
      const nameField = await screen.findByRole('textbox', { name: 'Name' })
      await user.type(nameField, 'Test Name')

      expect(Form).toHaveBeenCalledWith(expect.objectContaining({
        formData: {
          LongName: 'Long Name',
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
            Name: 'UMM-T',
            Version: '1.1'
          },
          Name: 'Test Name'
        }
      }), {})
    })
  })

  describe('when FormNavigation sends onBlur', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('@/js/components/FormNavigation/FormNavigation').default
      )
    })

    test('sets the field as a visistedField', async () => {
      const { user } = setup({})

      // Fill out a form field
      const nameField = await screen.findByRole('textbox', { name: 'Name' })
      await user.click(nameField)

      await act(async () => {
        nameField.blur()
      })

      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: ['mock-name']
      }), {})
    })
  })

  describe('when FormNavigation sends onSave', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('@/js/components/FormNavigation/FormNavigation').default
      )
    })

    describe('when the saveType is save', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Tool',
                metadata: {
                  LongName: 'Long Name',
                  MetadataSpecification: {
                    URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                    Name: 'UMM-T',
                    Version: '1.1'
                  }
                },
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2',
                ummVersion: getUmmVersion('Tool')
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

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT/tool-information?revisionId=3', { replace: true })

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and continue', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Tool',
                metadata: {
                  LongName: 'Long Name',
                  MetadataSpecification: {
                    URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                    Name: 'UMM-T',
                    Version: '1.1'
                  }
                },
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2',
                ummVersion: getUmmVersion('Tool')
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

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT/related-urls?revisionId=3')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and preview', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Tool',
                metadata: {
                  LongName: 'Long Name',
                  MetadataSpecification: {
                    URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                    Name: 'UMM-T',
                    Version: '1.1'
                  }
                },
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2',
                ummVersion: getUmmVersion('Tool')
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

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Preview' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT?revisionId=3')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and publish', () => {
      test('it should save the draft and call publish', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        // In order to publish we need to have a valid draft without any errors otherwise
        // the button will be disabled.
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

        const validMockDraft = {
          ...mockDraft,
          ummMetadata
        }

        const { user } = setup({
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
                draft: validMockDraft
              }
            }
          }, {
            request: {
              query: GET_AVAILABLE_PROVIDERS,
              variables: {
                params: {
                  limit: 500,
                  // Don't have an easy way to get a real uid into the context here
                  permittedUser: undefined,
                  target: 'PROVIDER_CONTEXT'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: [{
                    conceptId: 'mock-id-1',
                    providerIdentity: {
                      provider_id: 'MMT_1'
                    }
                  }, {
                    conceptId: 'mock-id-2',
                    providerIdentity: {
                      provider_id: 'MMT_2'
                    }
                  }]
                }
              }
            }
          },
          {
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Tool',
                metadata: ummMetadata,
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2',
                ummVersion: getUmmVersion('Tool')
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'TD1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }, {
            request: {
              query: PUBLISH_DRAFT,
              variables: {
                draftConceptId: 'TD1000000-MMT',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                ummVersion: getUmmVersion('Tool')
              }
            },
            result: {
              data: {
                publishDraft: {
                  conceptId: 'T1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })

        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Publish' })
        await user.click(button)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledTimes(2)
        }, { timeout: 5000 })

        expect(navigateSpy).toHaveBeenNthCalledWith(1, '/drafts/tools/TD1000000-MMT/tool-information?revisionId=1', expect.anything())
        expect(navigateSpy).toHaveBeenNthCalledWith(2, '/tools/T1000000-MMT')
      })
    })

    describe('when the ingest mutation returns an error', () => {
      test('calls errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Tool',
                metadata: {
                  LongName: 'Long Name',
                  MetadataSpecification: {
                    URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                    Name: 'UMM-T',
                    Version: '1.1'
                  }
                },
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2',
                ummVersion: getUmmVersion('Tool')
              }
            },
            error: new Error('An error occured')
          }]
        })

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occured'), 'MetadataForm: ingestDraftMutation')
      })
    })

    describe('when saving a new draft', () => {
      afterEach(() => {
        vi.restoreAllMocks()
      })

      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          pageUrl: '/drafts/collections/new',
          overrideMocks: [{
            request: {
              query: GET_AVAILABLE_PROVIDERS,
              variables: {
                params: {
                  limit: 500,
                  // Don't have an easy way to get a real uid into the context here
                  permittedUser: undefined,
                  target: 'PROVIDER_CONTEXT'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: [{
                    conceptId: 'mock-id-1',
                    providerIdentity: {
                      provider_id: 'MMT_1'
                    }
                  }, {
                    conceptId: 'mock-id-2',
                    providerIdentity: {
                      provider_id: 'MMT_2'
                    }
                  }]
                }
              }
            }
          }, {
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: {
                  ShortName: 'Test Short Name',
                  EntryTitle: 'Test Title'
                },
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_1',
                ummVersion: getUmmVersion('Collection')
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'CD1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        const shortNameField = await screen.findByRole('textbox', { name: 'ShortName' })
        await user.type(shortNameField, 'Test Short Name')

        const titleField = await screen.findByRole('textbox', { name: 'EntryTitle' })
        await user.type(titleField, 'Test Title')

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save' })
        await user.click(button)

        const modal = screen.getByRole('dialog')
        const modalSubmit = within(modal).getByRole('button', { name: 'Save' })
        await user.click(modalSubmit)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/CD1000000-MMT/collection-information?revisionId=1', { replace: true })

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })
  })

  describe('when the page is loaded with a fieldName in the URL', () => {
    test('sets the focus field and calls navigate to remove the fieldName from the URL', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      setup({
        pageUrl: '/drafts/tools/TD1000000-MMT/tool-information/Name'
      })

      await waitFor(() => {
        expect(Form).toHaveBeenCalledWith(expect.objectContaining({
          formContext: expect.objectContaining({
            focusField: 'Name'
          })
        }), {})
      })

      expect(Form).toHaveBeenCalledTimes(2)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT/tool-information', { replace: true })
    })
  })
})
