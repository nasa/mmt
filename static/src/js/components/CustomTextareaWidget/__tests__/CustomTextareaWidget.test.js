import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { userEvent } from '@testing-library/user-event'
import CustomTextareaWidget from '../CustomTextareaWidget'
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
    disable: false,
    label: 'Test Field',
    id: 'mock-id',
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
      <CustomTextareaWidget {...props} />
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

describe('CustomTextareaWidget', () => {
  describe('when the field is required', () => {
    test('renders a input element with a required icon', () => {
      setup({
        required: true
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveAttribute('id', 'mock-id')
      expect(field).toHaveAttribute('name', 'Test Field')

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

  describe('when a field is focused', () => {
    test('shows the field description', async () => {
      setup()

      const field = screen.getByRole('textbox')

      await waitFor(async () => {
        field.focus()
      })

      expect(field).toHaveFocus()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description'
      }), {})
    })
  })

  describe('when the field is blurred', () => {
    test('blurs the field', async () => {
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

      expect(props.onChange).toHaveBeenCalledWith(undefined)

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0
      }), {})
    })
  })

  describe('when the field has a custom title', () => {
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
})
