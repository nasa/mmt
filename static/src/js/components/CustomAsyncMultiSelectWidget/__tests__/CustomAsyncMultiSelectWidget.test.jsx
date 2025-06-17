import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AuthContext from '@/js/context/AuthContext'

import CustomAsyncMultiSelectWidget from '../CustomAsyncMultiSelectWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

vi.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const formContext = {
    focusField: '',
    setFocusField: vi.fn()
  }

  const props = {
    id: 'mock-id',
    label: 'Test Field',
    onBlur: vi.fn(),
    onChange: vi.fn(),
    placeholder: 'Test Placeholder',
    registry: {
      formContext
    },
    required: false,
    schema: {
      description: 'Test Description'
    },
    uiSchema: {
      'ui:search': {
        host: 'https://example.com',
        endpoint: '/users',
        parameter: 'query'
      }
    },
    value: [],
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <AuthContext.Provider value={
      {
        token: 'mock-jwt'
      }
    }
    >
      <CustomAsyncMultiSelectWidget {...props} />
    </AuthContext.Provider>
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

describe('CustomAsyncMultiSelectWidget', () => {
  describe('when the field is required', () => {
    test('renders a select element', async () => {
      const { user } = setup({
        required: true,
        value: [],
        uiSchema: {
          'ui:title': 'Title From UISchema',
          'ui:search': {
            host: 'https://example.com',
            endpoint: '/users',
            parameter: 'query'
          }
        }
      })

      expect(screen.getByText('Title From UISchema')).toBeInTheDocument()
      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('Please enter 3 or more characters')).toBeInTheDocument()

      // Called with extra []
      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(2)
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
      setup({
        required: true,
        value: [{
          id: 'testuser1',
          label: 'Test User 1'
        }, {
          id: 'testuser2',
          label: 'Test User 2'
        }]
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.queryByText('Test Placeholder')).not.toBeInTheDocument()

      expect(screen.getByText('Test User 1')).toBeInTheDocument()
      expect(screen.getByText('Test User 2')).toBeInTheDocument()
    })
  })

  describe('when user selects a value from the option list', () => {
    test('renders a select element with selected value', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          id: 'testuser1',
          label: 'Test User 1'
        }, {
          id: 'testuser2',
          label: 'Test User 2'
        }])
      })

      const {
        props,
        user
      } = setup({
        required: true
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.type(select, 'test')

      const option = screen.getByRole('option', { name: 'Test User 1 testuser1' })
      await user.click(option)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith([{
        id: 'testuser1',
        label: 'Test User 1'
      }])
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
})
