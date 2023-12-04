import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import CustomSelectWidget from '../CustomSelectWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

jest.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
  }

  const props = {
    disabled: false,
    id: 'mock-id',
    isLoading: false, /////
    label: 'Test Field',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    placeholder: 'Test Placeholder',
    registry: {
      formContext
    },
    required: false,
    schema: {
      description: 'Test Description'
    },
    uiSchema: {},
    value: undefined,
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomSelectWidget {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    jest.requireActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomSelectWidget', () => {
  describe('when the field is required', () => {
    test.only('renders a select element', () => {
      setup({
        required: true
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveAttribute('id', 'mock-id')
      expect(field).toHaveAttribute('name', 'Test Field')
      expect(field).toHaveAttribute('placeholder', 'Test Placeholder')
      expect(field).toHaveAttribute('type', 'text')
      expect(field).toHaveAttribute('value', '')

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0,
        description: null,
        headerClassName: null,
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
        value: 'Test Value'
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveAttribute('id', 'mock-id')
      expect(field).toHaveAttribute('name', 'Test Field')
      expect(field).toHaveAttribute('placeholder', 'Test Placeholder')
      expect(field).toHaveAttribute('type', 'text')
      expect(field).toHaveAttribute('value', 'Test Value')

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 10,
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field is focused', () => {
    test('shows the field description', async () => {
      setup()

      const field = screen.getByRole('textbox')

      await waitFor(async () => {
        field.focus()
      })

      expect(field).toHaveFocus()

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description'
      }), {})
    })
  })

  describe('when the field is blurred', () => {
    test('clears the focusField and calls onBlur', async () => {
      const { props } = setup()

      const field = screen.getByRole('textbox')

      await waitFor(async () => {
        field.focus()
        field.blur()
      })

      expect(props.registry.formContext.setFocusField).toHaveBeenCalledTimes(1)
      expect(props.registry.formContext.setFocusField).toHaveBeenCalledWith(null)

      expect(props.onBlur).toHaveBeenCalledTimes(1)
      expect(props.onBlur).toHaveBeenCalledWith('mock-id')

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: null
      }), {})
    })
  })

  describe('when the field is changed', () => {
    test('updates the charsUsed and calls onChange', async () => {
      const { props, user } = setup()

      const field = screen.getByRole('textbox')

      await user.type(field, 'New Value')

      expect(props.onChange).toHaveBeenCalledTimes(9)
      expect(props.onChange).toHaveBeenCalledWith('New Value')

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 9
      }), {})
    })
  })

  describe('when the field is cleared', () => {
    test('removes the value and sets charsUsed to 0', async () => {
      const { props, user } = setup({
        value: 'Test Value'
      })

      const field = screen.getByRole('textbox')

      await user.clear(field)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(undefined)

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0
      }), {})
    })
  })

  describe('when the field should be focused', () => {
    test('focuses the field', async () => {
      setup({
        registry: {
          formContext: {
            focusField: 'mock-id'
          }
        }
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveFocus()
    })
  })

  describe('when the field has a schema title', () => {
    test('uses the schema title', () => {
      setup({
        uiSchema: {
          'ui:title': 'Schema Title'
        }
      })

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0,
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Schema Title'
      }), {})
    })
  })
})
