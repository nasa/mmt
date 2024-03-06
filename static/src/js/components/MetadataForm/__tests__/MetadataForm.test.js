import React from 'react'
import {
  render,
  screen,
  waitFor
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

import { Cookies, CookiesProvider } from 'react-cookie'
import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'

import errorLogger from '../../../utils/errorLogger'

import relatedUrlsUiSchema from '../../../schemas/uiSchemas/tools/relatedUrls'
import toolInformationUiSchema from '../../../schemas/uiSchemas/tools/toolInformation'
import ummTSchema from '../../../schemas/umm/ummTSchema'

import BoundingRectangleField from '../../BoundingRectangleField/BoundingRectangleField'
import CustomArrayFieldTemplate from '../../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomCountrySelectWidget from '../../CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '../../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '../../CustomFieldTemplate/CustomFieldTemplate'
import CustomRadioWidget from '../../CustomRadioWidget/CustomRadioWidget'
import CustomSelectWidget from '../../CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '../../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../../CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '../../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import FormNavigation from '../../FormNavigation/FormNavigation'
import GridLayout from '../../GridLayout/GridLayout'
import JsonPreview from '../../JsonPreview/JsonPreview'
import KeywordPicker from '../../KeywordPicker/KeywordPicker'
import MetadataForm from '../MetadataForm'
import Providers from '../../../providers/Providers/Providers'
import StreetAddressField from '../../StreetAddressField/StreetAddressField'
import toolsConfiguration from '../../../schemas/uiForms/toolsConfiguration'

import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'
import OneOfField from '../../OneOfField/OneOfField'
import { PUBLISH_DRAFT } from '../../../operations/mutations/publishDraft'

jest.mock('@rjsf/core', () => jest.fn(({
  onChange,
  onBlur,
  formData
}) => (
  // This mock component renders a single input field for a 'Name' field. This allows the
  // tests that need to call onChange/onBlur to actually modify the state/context in MetadataForm
  <mock-Component data-testid="MockForm">
    <input
      id="Name"
      name="Name"
      onChange={
        (event) => {
          const { value } = event.target

          onChange({
            formData: {
              Name: value
            }
          })
        }
      }
      onBlur={() => onBlur('mock-name')}
      value={formData.Name || ''}
    />
  </mock-Component>
)))

jest.mock('../../ErrorBanner/ErrorBanner')
jest.mock('../../JsonPreview/JsonPreview')
jest.mock('../../FormNavigation/FormNavigation')
jest.mock('../../../utils/errorLogger')

global.fetch = jest.fn()

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid'
  }
})

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
  pageUrl = '/drafts/tools/TD1000000-MMT/tool-information'
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
          <MemoryRouter initialEntries={[pageUrl]}>
            <Routes>
              <Route
                path="/drafts/:draftType"
              >
                <Route
                  element={<MetadataForm />}
                  path="new"
                />
                <Route
                  path=":conceptId/:sectionName"
                  element={<MetadataForm />}
                />
                <Route
                  path=":conceptId/:sectionName/:fieldName"
                  element={<MetadataForm />}
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

describe('MetadataForm', () => {
  describe('when the concept type is a Tool draft', () => {
    describe('when on the related-urls form', () => {
      test('renders a Form component', async () => {
        setup({
          pageUrl: '/drafts/tools/TD1000000-MMT/related-urls'
        })

        await waitForResponse()

        expect(Form).toHaveBeenCalledTimes(2)
        expect(Form).toHaveBeenCalledWith(expect.objectContaining({
          fields: {
            BoundingRectangle: BoundingRectangleField,
            AnyOfField: expect.any(Function),
            OneOfField,
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
    })

    describe('when rendering a new draft form', () => {
      test('renders the Form component for the tool-information page', async () => {
        setup({
          overrideMocks: [],
          pageUrl: '/drafts/tools/new'
        })

        expect(Form).toHaveBeenCalledTimes(2)
        expect(Form).toHaveBeenCalledWith(expect.objectContaining({
          fields: {
            BoundingRectangle: BoundingRectangleField,
            AnyOfField: expect.any(Function),
            OneOfField,
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

    test('renders a FormNavigation component', async () => {
      setup({})

      await waitForResponse()

      expect(FormNavigation).toHaveBeenCalledTimes(2)
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

    test('renders a JsonPreview component', async () => {
      setup({})

      await waitForResponse()

      expect(JsonPreview).toHaveBeenCalledTimes(2)
    })
  })

  describe('when FormNavigation sends onCancel', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        jest.requireActual('../../FormNavigation/FormNavigation').default
      )
    })

    test('resets the form to the original values', async () => {
      const { user } = setup({})

      await waitForResponse()

      // Fill out a form field
      const nameField = screen.getByRole('textbox', { id: 'Name' })
      await user.type(nameField, 'Test Name')
      await waitFor(async () => {
        await nameField.blur()
      })

      expect(nameField).toHaveValue('Test Name')
      expect(FormNavigation).toHaveBeenCalledTimes(12)
      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: ['mock-name']
      }), {})

      jest.clearAllMocks()

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(nameField).toHaveValue('')
      expect(FormNavigation).toHaveBeenCalledTimes(1)
      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: []
      }), {})
    })
  })

  describe('when FormNavigation sends onChange', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        jest.requireActual('../../FormNavigation/FormNavigation').default
      )
    })

    test('updates the draft context value', async () => {
      const { user } = setup({})

      await waitForResponse()

      // Fill out a form field
      const nameField = screen.getByRole('textbox', { id: 'Name' })
      await user.type(nameField, 'Test Name')

      expect(Form).toHaveBeenCalledWith(expect.objectContaining({
        formData: {
          Name: 'Test Name'
        }
      }), {})
    })
  })

  describe('when FormNavigation sends onBlur', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        jest.requireActual('../../FormNavigation/FormNavigation').default
      )
    })

    test('sets the field as a visistedField', async () => {
      const { user } = setup({})

      await waitForResponse()

      // Fill out a form field
      const nameField = screen.getByRole('textbox', { id: 'Name' })
      await user.click(nameField)
      await waitFor(async () => {
        await nameField.blur()
      })

      expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
        visitedFields: ['mock-name']
      }), {})
    })
  })

  describe('when FormNavigation sends onSave', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        jest.requireActual('../../FormNavigation/FormNavigation').default
      )
    })

    describe('when the saveType is save', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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
                ummVersion: '1.0.0'
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

        const dropdown = screen.getByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('../TD1000000-MMT/tool-information', { replace: true })

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and continue', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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
                ummVersion: '1.0.0'
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

        const button = screen.getByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('../TD1000000-MMT/related-urls')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and preview', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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
                ummVersion: '1.0.0'
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

        const dropdown = screen.getByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Preview' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('../TD1000000-MMT')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when the saveType is save and preview', () => {
      test('it should save the draft and call publish', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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
                ummVersion: '1.0.0'
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
          },
          {
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
                  conceptId: 'TL1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }
          ]
        })

        await waitForResponse()

        const dropdown = screen.getByRole('button', { name: 'Save Options' })

        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Publish' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/tools/TL1000000-MMT/1')
      })
    })

    describe('when the ingest mutation returns an error', () => {
      test('calls errorLogger', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

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
                ummVersion: '1.0.0'
              }
            },
            error: new Error('An error occured')
          }]
        })

        await waitForResponse()

        const button = screen.getByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occured'), 'MetadataForm: ingestDraftMutation')
      })
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

  describe('when the page is loaded with a fieldName in the URL', () => {
    test('sets the focus field and calls navigate to remove the fieldName from the URL', async () => {
      const navigateSpy = jest.fn()
      jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      setup({
        pageUrl: '/drafts/tools/TD1000000-MMT/tool-information/Name'
      })

      await waitForResponse()

      expect(Form).toHaveBeenCalledTimes(2)
      expect(Form).toHaveBeenCalledWith(expect.objectContaining({
        formContext: expect.objectContaining({
          focusField: 'Name'
        })
      }), {})

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('../TD1000000-MMT/tool-information', { replace: true })
    })
  })
})
