import React from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'
import userEvent from '@testing-library/user-event'
import Form from '@rjsf/core'

import Providers from '@/js/providers/Providers/Providers'

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
import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import FormNavigation from '@/js/components/FormNavigation/FormNavigation'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import KeywordPicker from '@/js/components/KeywordPicker/KeywordPicker'
import OneOfField from '@/js/components/OneOfField/OneOfField'
import StreetAddressField from '@/js/components/StreetAddressField/StreetAddressField'

import createTemplate from '@/js/utils/createTemplate'
import errorLogger from '@/js/utils/errorLogger'
import getTemplate from '@/js/utils/getTemplate'
import updateTemplate from '@/js/utils/updateTemplate'

import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import TemplateForm from '../TemplateForm'

import staticConfig from '../../../../../../static.config.json'

vi.mock('@/js/utils/createTemplate')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/getTemplate')
vi.mock('@/js/utils/updateTemplate')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/components/FormNavigation/FormNavigation')

const getConfig = () => staticConfig

const ummCVersion = getConfig().ummVersions.ummC

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

vi.mock('@rjsf/core', () => ({
  default: vi.fn(({
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
  ))
}))

const setup = ({ pageUrl }) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider>
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route
              element={<TemplateForm />}
              path="templates/:templateType/new"
            />
            <Route
              path="templates/:templateType/:id/:sectionName"
              element={<TemplateForm />}
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

const mutationSetup = ({ mocks }) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/templates/collections/1234-abcd-5678-efgh']}>
          <Routes>
            <Route
              element={<TemplateForm />}
              path="templates/:templateType/:id"
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

describe('TemplateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when rendering a new collection template ', () => {
    test('renders the Form component for the collection-information page', async () => {
      setup({ pageUrl: '/templates/collections/new' })

      await waitFor(() => {
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

  describe('when rendering a collection template', () => {
    test('renders the Form component for the collection-information page', async () => {
      getTemplate.mockReturnValue({
        response: {
          template: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          providerId: 'MMT_2'
        }
      })

      setup({ pageUrl: '/templates/collections/e471a24f-0791-4df8-b737-357fddf9d487/collection-information' })

      expect(getTemplate).toHaveBeenCalledTimes(1)

      await waitFor(() => {
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
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
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

    test('renders a error banner', async () => {
      getTemplate.mockReturnValue({
        error: 'An error occurred'
      })

      setup({ pageUrl: '/templates/collections/e471a24f-0791-4df8-b737-357fddf9d487/collection-information' })

      await waitFor(() => {
        expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
          message: 'An error occurred'
        }), {})
      })

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('when saving and navigating', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('@/js/components/FormNavigation/FormNavigation').default
      )
    })

    describe('when clicking on save', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        updateTemplate.mockReturnValue({ ok: true })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/1234-abcd-5678-efgh/collection-information', { replace: true })

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when clicking on save and continue', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        updateTemplate.mockReturnValue({ ok: true })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/1234-abcd-5678-efgh/data-identification')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when clicking on save and continue results in an error', () => {
      test('calls addNotification and errorLogger', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        updateTemplate.mockReturnValue({ ok: false })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error saving template', 'TemplateForm: updateTemplate')
      })
    })

    describe('when clicking on save and continue results in an error for a new template', () => {
      test('calls addNotification and errorLogger', async () => {
        createTemplate.mockReturnValue({ ok: false })

        const { user } = setup({ pageUrl: '/templates/collections/new' })

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        const modal = screen.getByRole('dialog')
        const modalButton = within(modal).getByRole('button', { name: 'Save & Continue' })
        await user.click(modalButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error creating template', 'TemplateForm: createTemplate')
      })
    })

    describe('when clicking on save and continue for a new template', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        createTemplate.mockReturnValue({ id: '1234-abcd-5678-efgh' })

        const { user } = setup({ pageUrl: '/templates/collections/new/collection-information' })

        const button = await screen.findByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        const modal = screen.getByRole('dialog')
        const modalButton = within(modal).getByRole('button', { name: 'Save & Continue' })
        await user.click(modalButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/1234-abcd-5678-efgh/data-identification')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when clicking save and preview', () => {
      test('navigates to the templatePreview', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        updateTemplate.mockReturnValue({ ok: true })

        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

        const dropdown = await screen.findByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Preview' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/1234-abcd-5678-efgh')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when clicking on onCancel', () => {
      test('resets the form to the original values', async () => {
        const originalDraft = {
          TemplateName: 'Mock Template',
          ShortName: 'Template Form Test',
          Version: '1.0.0'
        }
        getTemplate.mockReturnValue({
          response: {
            template: originalDraft,
            providerId: 'MMT_2'
          }
        })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

        // Fill out a form field
        const nameField = await screen.findByRole('textbox', { id: 'Name' })
        await user.type(nameField, 'A')
        await user.tab()

        expect(await screen.findByRole('textbox', {
          id: 'Name',
          value: 'A'
        })).toBeInTheDocument()

        expect(FormNavigation).toHaveBeenCalledTimes(4)
        expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
          draft: {
            ...originalDraft,
            Name: 'A'
          },
          visitedFields: ['mock-name']
        }), {})

        vi.clearAllMocks()

        const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(await screen.findByRole('textbox', {
          id: 'Name',
          value: ''
        })).toBeInTheDocument()

        expect(FormNavigation).toHaveBeenCalledTimes(1)
        expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
          draft: originalDraft,
          visitedFields: []
        }), {})
      })
    })

    describe('when clicking on save and create draft', () => {
      beforeEach(() => {
        getTemplate.mockReturnValue({
          response: {
            template: {
              TemplateName: 'Mock Template',
              ShortName: 'Template Form Test',
              Version: '1.0.0'
            },
            providerId: 'MMT_2'
          }
        })
      })

      describe('when clicking on save and create button results in a success', () => {
        test('should ingest a collectionDraft and navigate to collection draft', async () => {
          const navigateSpy = vi.fn()
          vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

          const { user } = mutationSetup({
            mocks: [{
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Collection',
                  metadata: {
                    ShortName: 'Template Form Test',
                    Version: '1.0.0'
                  },
                  nativeId: 'MMT_mock-uuid',
                  providerId: 'MMT_2',
                  ummVersion: `${ummCVersion}`
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

          updateTemplate.mockReturnValue({ ok: true })

          const dropdown = await screen.findByRole('button', { name: 'Save Options' })
          await user.click(dropdown)

          const button = screen.getByRole('button', { name: 'Save & Create Draft' })
          await user.click(button)

          await waitFor(() => {
            expect(updateTemplate).toHaveBeenCalledWith('MMT_2', null, {
              ShortName: 'Template Form Test',
              TemplateName: 'Mock Template',
              Version: '1.0.0'
            }, '1234-abcd-5678-efgh')
          })

          expect(updateTemplate).toHaveBeenCalledTimes(1)

          expect(navigateSpy).toHaveBeenCalledTimes(1)
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/CD1000000-MMT')
        })
      })

      describe('when clicking on save create button results in a failure', () => {
        test('calls errorLogger', async () => {
          const navigateSpy = vi.fn()
          vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

          const { user } = mutationSetup({
            mocks: [{
              request: {
                query: INGEST_DRAFT,
                variables: {
                  conceptType: 'Collection',
                  metadata: {
                    ShortName: 'Template Form Test',
                    Version: '1.0.0'
                  },
                  nativeId: 'MMT_mock-uuid',
                  providerId: 'MMT_2',
                  ummVersion: '1.18.2'
                }
              },
              error: new Error('An error occurred')
            }]
          })

          const dropdown = await screen.findByRole('button', { name: 'Save Options' })
          await user.click(dropdown)

          const button = screen.getByRole('button', { name: 'Save & Create Draft' })
          await user.click(button)

          expect(navigateSpy).toHaveBeenCalledTimes(0)

          expect(errorLogger).toHaveBeenCalledTimes(1)
          expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
        })
      })
    })
  })
})
