import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CustomTitleField from '../CustomTitleField'

const setup = (overrideProps = {}) => {
  const props = {
    title: 'Test field',
    required: true,
    registry: {
      formContext: {
        focusField: '',
        setFocusField: jest.fn()
      }
    },
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomTitleField {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('CustomTitleField', () => {
  describe('when a field is required', () => {
    test('renders the section name and a required icon', () => {
      setup({
        required: true
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Required' })).toBeInTheDocument()
    })
  })

  describe('when a field is not required', () => {
    test('renders the section name and no required icon', () => {
      setup({
        required: false
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.queryByTitle('Test Field')).toBeNull()
    })
  })

  describe('when a custom title is provided', () => {
    test('renders the custom section title', () => {
      setup({
        uiSchema: {
          'ui:title': 'Custom Title'
        }
      })

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      expect(screen.queryByText('Test field')).not.toBeInTheDocument()
    })
  })

  describe('when hideHeader is true', () => {
    test('renders no title', () => {
      setup({
        uiSchema: {
          'ui:hide-header': true
        }
      })

      expect(screen.queryByText('Test field')).not.toBeInTheDocument()
    })
  })
})
