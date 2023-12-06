import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CustomTitleField from '../CustomTitleField'

const setupCustomTitleField = (overrideProps = {}) => {
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
      setupCustomTitleField({
        required: true
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.getByTitle('Test Field').className).toContain('eui-icon eui-required-o text-success ps-1')
    })
  })

  describe('when a field is not required', () => {
    test('renders the section name and no required icon', () => {
      setupCustomTitleField({
        required: false
      })

      expect(screen.getByText('Test Field')).toBeInTheDocument()
      expect(screen.queryByTitle('Test Field')).toBeNull()
    })
  })

  describe('when a custom title is provided', () => {
    test('renders the custom section title', () => {
      setupCustomTitleField({
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
      setupCustomTitleField({
        uiSchema: {
          'ui:hide-header': true
        }
      })

      expect(screen.queryByText('Test field')).not.toBeInTheDocument()
    })
  })
})
