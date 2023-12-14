import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import CustomDateTimeWidget from '../CustomDateTimeWidget'
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
    label: 'Test field',
    id: 'mock-id',
    onChange,
    onBlur,
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
      <CustomDateTimeWidget {...props} />
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

describe('CustomDateTimeWidget', () => {
  describe('when the field is required', () => {
    test('renders the dateTime widget with a required icon', () => {
      setup({
        required: true
      })

      expect(screen.getByRole('img', { name: 'Required' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: null,
        maxLength: null,
        required: true,
        headerClassName: null,
        label: 'Test field',
        description: 'Test Description'
      }), {})
    })
  })

  describe('when a field is focused', () => {
    test('shows the field description', async () => {
      setup()

      const field = screen.getByPlaceholderText('YYYY-MM-DDTHH:MM:SSZ')

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

      const field = screen.getByPlaceholderText('YYYY-MM-DDTHH:MM:SSZ')

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

      const field = screen.getByPlaceholderText('YYYY-MM-DDTHH:MM:SSZ')

      await user.type(field, '1')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith('2001-01-01T00:00:00.000Z')
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
      expect(screen.getByText('Schema Title')).toBeInTheDocument()
    })
  })

  describe('when the field should be focused', () => {
    test('shows the calender', async () => {
      // Getting a console warning: An update to Popper inside a test was not wrapped in act(...).
      // Wrapping the setup in an act fixed the warning
      await act(async () => {
        setup({
          registry: {
            formContext: {
              focusField: 'mock-id'
            }
          }
        })
      })

      // Checks if the widget is focused by checking if the description is present.
      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description'
      }), {})
    })
  })

  describe('When a date is already save in the form', () => {
    test('shows the date', () => {
      setup({
        value: '2023-12-05T00:00:00.000Z'
      })

      const field = screen.getByPlaceholderText('YYYY-MM-DDTHH:MM:SSZ')

      expect(field).toHaveValue('2023-12-05T00:00:00.000Z')
    })
  })
})
