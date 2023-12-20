import React from 'react'
import { render, screen } from '@testing-library/react'
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
        retrieveSchema: jest.fn().mockReturnValue({
          enum: [
            'Option1',
            'Option2',
            'Option3',
            'Option4'
          ]
        })
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

  render(
    <CustomMultiSelectWidget {...props} />
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

describe('CustomMultiSelectWidget', () => {
  describe('when the field is required', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        required: true,
        value: [],
        uiSchema: {
          'ui:title': 'Title From UISchema'
        }
      })

      expect(screen.getByText('Title From UISchema')).toBeInTheDocument()
      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByRole('option', { name: 'Option1' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Option2' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Option3' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Option4' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: true,
        title: 'Title From UISchema'
      }), {})
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

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Schema Title'
      }), {})
    })
  })

  describe('when the field has values', () => {
    test('renders a select element with values', async () => {
      const { user } = setup({
        required: true,
        value: ['Option1', 'Option2']
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.queryByText('Test Placeholder')).not.toBeInTheDocument()

      expect(screen.getByText('Option1').className).toContain('MultiValueGeneric')
      expect(screen.getByText('Option2').className).toContain('MultiValueGeneric')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.queryByRole('option', { name: 'Option1' })).not.toBeInTheDocument()
      expect(screen.queryByRole('option', { name: 'Option2' })).not.toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Option3' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Option4' })).toBeInTheDocument()
    })
  })

  describe('when user selects a value from the option list', () => {
    test('renders a select element with selected value', async () => {
      const {
        props,
        user
      } = setup({
        required: true
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      const option = screen.getByRole('option', { name: 'Option2' })
      await user.click(option)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(['Option2'])
    })
  })
})
