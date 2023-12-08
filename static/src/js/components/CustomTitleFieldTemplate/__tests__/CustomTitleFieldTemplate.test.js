import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate'

describe('CustomTitleFieldTemplate', () => {
  const defaultProps = {
    title: 'Test Title',
    required: false,
    registry: {
      formContext: {
        focusField: '',
        setFocusField: jest.fn()
      }
    },
    uiSchema: {}
  }

  describe('when a title field is not required', () => {
    test('renders it with no required icon', () => {
      render(
        <BrowserRouter>
          <CustomTitleFieldTemplate {...defaultProps} />
        </BrowserRouter>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.queryByTitle('Test Title')).not.toBeInTheDocument()
    })
  })

  describe('when a title field is required', () => {
    test('renders it with the required icon', () => {
      render(
        <BrowserRouter>
          <CustomTitleFieldTemplate {...defaultProps} required />
        </BrowserRouter>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByTitle('Test Title').className).toContain('eui-icon eui-required-o required-icon')
    })
  })

  describe('when a title field is a custom UI title', () => {
    test('renders it with custom UI title', () => {
      const customProps = {
        ...defaultProps,
        uiSchema: {
          options: {
            title: 'Custom UI Title'
          }
        }
      }
      render(
        <BrowserRouter>
          <CustomTitleFieldTemplate {...customProps} />
        </BrowserRouter>
      )

      expect(screen.getByText('Custom UI Title')).toBeInTheDocument()
    })
  })

  describe('when a title field with custom header class names', () => {
    test('renders it with custom header class names', () => {
      const customProps = {
        ...defaultProps,
        uiSchema: {
          'ui:header-classname': 'custom-header',
          'ui:header-box-classname': 'custom-header-box'
        }
      }
      render(
        <BrowserRouter>
          <CustomTitleFieldTemplate {...customProps} />
        </BrowserRouter>
      )

      expect(screen.getByText('Test Title')).toHaveClass('custom-header')
      expect(screen.getByText('Test Title').parentElement).toHaveClass('custom-header-box')
    })
  })

  describe('when a title field with hide-header set to true', () => {
    it('renders it with no header', () => {
      const customProps = {
        ...defaultProps,
        uiSchema: {
          'ui:hide-header': true
        }
      }
      render(
        <BrowserRouter>
          <CustomTitleFieldTemplate {...customProps} />
        </BrowserRouter>
      )

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    })
  })
})
