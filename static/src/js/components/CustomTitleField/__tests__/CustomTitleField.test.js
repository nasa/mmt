import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomTitleField from '../CustomTitleField'

const setup = (overrideProps = {}) => {
  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
  }
  const props = {
    required: true,
    title: 'Test field',
    registry: {
      formContext
    },
    ...overrideProps
  }
  render(
    <CustomTitleField {...props} />
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

  describe('when the field should be focused', () => {
    test('focuses the title', async () => {
      setup({
        title: 'mock-id',
        registry: {
          formContext: {
            focusField: 'mock-id'
          }
        }
      })

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1)
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })
  })
})
