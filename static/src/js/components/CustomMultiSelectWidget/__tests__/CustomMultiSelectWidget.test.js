import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import CustomMultiSelectWidget from '../CustomMultiSelectWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

jest.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
  }

  const props = {
    id: 'mock-id',
    label: 'Test Field',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    placeholder: 'Test Placeholder',
    registry: {
      formContext,
      schemaUtils: {
        retrieveSchema: jest.fn().mockReturnValue({ enum: ['Option1', 'Option2', 'Option3', 'Option4'] })
      }
    },
    required: false,
    schema: {
      description: 'Test Description',
      items: {
      }
    },
    uiSchema: {},
    value: [],
    ...overrideProps
  }

  const component = render(
    <BrowserRouter>
      <CustomMultiSelectWidget {...props} />
    </BrowserRouter>
  )

  return {
    component,
    props,
    user: userEvent.setup()
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    jest.requireActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomMultiSelectWidget', () => {
  describe('when the field is required', () => {
    test('renders a select element', () => {
      const {
        component
      } = setup({
        required: true,
        value: [],
        uiSchema: {
          'ui:title': 'Title From UISchema'
        }
      })

      expect(component.container).toHaveTextContent('Title From UISchema')
      expect(component.container).toHaveTextContent('Test Placeholder')

      const field = screen.getByRole('combobox')
      expect(field).toHaveAttribute('id', 'react-select-2-input')
      expect(field).toHaveAttribute('type', 'text')

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: true,
        title: 'Title From UISchema'
      }), {})
    })
  })

  describe('when the field has values', () => {
    test('renders a select element with values', () => {
      const {
        component
      } = setup({
        required: true,
        value: ['Web', 'Portal']
      })

      expect(component.container).toHaveTextContent('Test Field')
      expect(component.container).not.toHaveTextContent('Test Placeholder')
      expect(component.container).toHaveTextContent('Web')
      expect(component.container).toHaveTextContent('Portal')

      const field = screen.getByRole('combobox')
      expect(field).toHaveAttribute('type', 'text')
    })
  })

  describe('when user selects a value from the option list', () => {
    test('renders a select element with selected value', async () => {
      const {
        component,
        user,
        props
      } = setup({
        required: true,
        value: ['Web', 'Portal']
      })

      expect(component.container).toHaveTextContent('Test Field')
      expect(component.container).not.toHaveTextContent('Test Placeholder')
      expect(component.container).toHaveTextContent('Web')
      expect(component.container).toHaveTextContent('Portal')

      const field = screen.getByRole('combobox')
      expect(field).toHaveAttribute('type', 'text')

      await user.click(field, { key: 'ArrowDown' })
      await user.click(await screen.getByText('Option2'))
      expect(props.onChange).toHaveBeenCalledWith(['Web', 'Portal', 'Option2'])
    })
  })
})
