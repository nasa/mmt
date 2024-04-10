import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'
import userEvent from '@testing-library/user-event'
import { Cookies, CookiesProvider } from 'react-cookie'
import Form from '@rjsf/core'

import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import Providers from '../../../providers/Providers/Providers'
import TemplateForm from '../TemplateForm'

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
import FormNavigation from '../../FormNavigation/FormNavigation'
import GridLayout from '../../GridLayout/GridLayout'
import KeywordPicker from '../../KeywordPicker/KeywordPicker'
import OneOfField from '../../OneOfField/OneOfField'
import StreetAddressField from '../../StreetAddressField/StreetAddressField'

import createTemplate from '../../../utils/createTemplate'
import errorLogger from '../../../utils/errorLogger'
import getTemplate from '../../../utils/getTemplate'
import updateTemplate from '../../../utils/updateTemplate'

vi.mock('../../../utils/createTemplate')
vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/getTemplate')
vi.mock('../../../utils/updateTemplate')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../FormNavigation/FormNavigation')

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

const setup = ({ pageUrl }) => {
  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
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
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('TemplateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when rendering a new collection template ', () => {
    test('renders the Form component for the collection-information page', async () => {
      setup({ pageUrl: '/templates/collections/new' })

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
  })

  describe('when rendering a collection template', () => {
    test('renders the Form component for the collection-information page', async () => {
      getTemplate.mockReturnValue({
        response: {
          TemplateName: 'Mock Template',
          ShortName: 'Template Form Test',
          Version: '1.0.0'
        }
      })

      setup({ pageUrl: '/templates/collections/e471a24f-0791-4df8-b737-357fddf9d487/collection-information' })

      await waitForResponse()

      expect(getTemplate).toHaveBeenCalledTimes(1)

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

    test('renders a error banner', async () => {
      getTemplate.mockReturnValue({
        error: 'An error occurred'
      })

      setup({ pageUrl: '/templates/collections/e471a24f-0791-4df8-b737-357fddf9d487/collection-information' })

      await waitForResponse()

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('when saving and navigating', () => {
    beforeEach(() => {
      FormNavigation.mockImplementation(
        vi.importActual('../../FormNavigation/FormNavigation').default
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

        await waitForResponse()

        const dropdown = screen.getByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save' })
        await user.click(button)

        await waitForResponse()

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

        await waitForResponse()

        const button = screen.getByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        await waitForResponse()

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

        await waitForResponse()

        const button = screen.getByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error saving template', 'TemplateForm: updateTemplate')
      })
    })

    describe('when clicking on save and continue for a new template', () => {
      test('navigates to the current form and calls scrolls to the top', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        createTemplate.mockReturnValue('1234-abcd-5678-efgh')

        const { user } = setup({ pageUrl: '/templates/collections/new/collection-information' })

        await waitForResponse()

        const button = screen.getByRole('button', { name: 'Save & Continue' })
        await user.click(button)

        await waitForResponse()

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

        await waitForResponse()
        const dropdown = screen.getByRole('button', { name: 'Save Options' })
        await user.click(dropdown)

        const button = screen.getByRole('button', { name: 'Save & Preview' })
        await user.click(button)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/1234-abcd-5678-efgh')

        expect(window.scroll).toHaveBeenCalledTimes(1)
        expect(window.scroll).toHaveBeenCalledWith(0, 0)
      })
    })

    describe('when clicking on onCancel', () => {
      test('resets the form to the original values', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        updateTemplate.mockReturnValue({ ok: true })

        const { user } = setup({ pageUrl: '/templates/collections/1234-abcd-5678-efgh/collection-information' })

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

        vi.clearAllMocks()

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(nameField).toHaveValue('')
        expect(FormNavigation).toHaveBeenCalledTimes(1)
        expect(FormNavigation).toHaveBeenCalledWith(expect.objectContaining({
          visitedFields: []
        }), {})
      })
    })
  })
})
