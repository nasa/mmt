import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import CustomTextWidget from '../CustomTextWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

jest.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const onBlur = jest.fn()
  const onChange = jest.fn()
  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
  }

  const props = {
    disabled: false,
    label: 'Test Field',
    id: 'mock-id',
    placeholder: 'Test Placeholder',
    onBlur,
    onChange,
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
      <CustomTextWidget {...props} />
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

describe('CustomTextWidget', () => {
  describe('when the field is required', () => {
    test('renders a input element', () => {
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
        description: 'Test Description',
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: true,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field has a value', () => {
    test('renders a input element', () => {
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
        description: 'Test Description',
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
    })
  })

  describe('when the field is changed', () => {
    test('calls onChange', async () => {
      const { props, user } = setup()

      const field = screen.getByRole('textbox')

      // The input in this component is a controlled input by the `value` prop. We don't want to deal with the
      // setup of saving that value state outside of the test render, so we can only test a single character change
      // here. If we tried to type multiple letters, onChange toHaveBeenCalledWith only receives a single letter
      // because the value prop is alway undefined.
      await user.type(field, 'N')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith('N')
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
        description: 'Test Description',
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Schema Title'
      }), {})
    })
  })

  describe('when the input is a number field', () => {
    test('renders a number field', () => {
      setup({
        uiSchema: {
          'ui:type': 'number'
        }
      })

      const field = screen.getByRole('spinbutton')
      expect(field).toHaveAttribute('type', 'number')
    })
  })
})
