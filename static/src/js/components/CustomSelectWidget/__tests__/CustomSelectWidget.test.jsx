import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomSelectWidget from '../CustomSelectWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'
import useControlledKeywords from '../../../hooks/useControlledKeywords'
import parseCmrResponse from '../../../utils/parseCmrResponse'

vi.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')
vi.mock('../../../hooks/useControlledKeywords')
vi.mock('../../../utils/parseCmrResponse')

const setup = (overrideProps = {}, mockControlledKeywords = true) => {
  useControlledKeywords.mockReturnValue({
    keywords: mockControlledKeywords && [
      {
        value: 'application/gml+xml',
        label: 'application/gml+xml'
      },
      {
        value: 'application/gzip',
        label: 'application/gzip'
      },
      {
        value: 'application/json',
        label: 'application/json'
      }
    ],
    isLoading: false
  })

  parseCmrResponse.mockReturnValue([
    ['application/gml+xml'],
    ['application/gzip'],
    ['application/json']
  ])

  const formContext = {
    focusField: '',
    setFocusField: vi.fn()
  }

  const props = {
    disabled: false,
    id: 'mock-id',
    label: 'Test Field',
    onBlur: vi.fn(),
    onChange: vi.fn(),
    placeholder: 'Test Placeholder',
    registry: {
      formContext,
      schemaUtils: {
        retrieveSchema: vi.fn().mockReturnValue({})
      }
    },
    required: false,
    schema: {
      description: 'Test Description'
    },
    selectOptions: undefined,
    value: undefined,
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <CustomSelectWidget {...props} />
  )

  return {
    props,
    user
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    vi.importActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomSelectWidget', () => {
  describe('when the field is given schema enums for options', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        schema: {
          description: 'Test Description',
          enum: [
            'Schema Enum 1',
            'Schema Enum 2'
          ]
        }
      }, false)

      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'Schema Enum 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Schema Enum 2' })).toBeInTheDocument()

      // First call is loading the page
      // Second call is setting the options
      // Third call is []
      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(3)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field is given selectOptions props', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        selectOptions: [
          'Select Options Enum 1',
          'Select Options Enum 2'
        ]
      }, false)

      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'Select Options Enum 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Select Options Enum 2' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field is given ui:options', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        uiSchema: {
          'ui:options': {
            enumOptions: [
              'UI Schema Options Enum 1',
              'UI Schema Options Enum 2'
            ]
          }
        }
      }, false)

      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'UI Schema Options Enum 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'UI Schema Options Enum 2' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field uses controlled keywords', () => {
    test('renders a select element', async () => {
      const { user } = setup()

      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'application/gml+xml' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'application/gzip' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'application/json' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field is required', () => {
    test('renders a select element', async () => {
      setup({
        required: true
      })

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: true,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field has a value', () => {
    test('renders a select element', () => {
      setup({
        value: 'application/json'
      })

      expect(screen.getByText('application/json').className).toContain('singleValue')
    })
  })

  describe('when the field is changed', () => {
    test('calls onChange', async () => {
      const { props, user } = setup()

      const field = screen.getByRole('combobox')
      await user.click(field)

      const option = screen.getByRole('option', { name: 'application/json' })
      await user.click(option)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith('application/json')
    })
  })

  describe('when the field should be focused', () => {
    test('focuses the field', async () => {
      setup({
        registry: {
          formContext: {
            focusField: 'mock-id'
          },
          schemaUtils: {
            retrieveSchema: vi.fn().mockReturnValue({})
          }
        }
      })

      const field = screen.getByRole('combobox')

      expect(field).toHaveFocus()
    })
  })

  describe('when the field has a schema title', () => {
    test('uses the schema title', () => {
      setup({
        placeholder: undefined,
        uiSchema: {
          'ui:title': 'Schema Title'
        }
      })

      expect(screen.getByText('Select Schema Title').className).toContain('placeholder')

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Schema Title'
      }), {})
    })
  })

  describe('when the field uses oneOf enums options', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        options: {
          enumOptions: [
            {
              label: 'oneOf value 1',
              value: 0
            },
            {
              label: 'oneOf value 2',
              value: 1
            }
          ]
        }
      }, false)

      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'oneOf value 1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'oneOf value 2' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when an integer value is selected', () => {
    test('render', () => {
      setup({
        options: {
          enumOptions: [
            {
              label: 'oneOf value 1',
              value: 0
            },
            {
              label: 'oneOf value 2',
              value: 1
            }
          ]
        },
        value: 1
      }, false)

      expect(screen.getByText('oneOf value 2').className).toContain('singleValue')
    })
  })
})
