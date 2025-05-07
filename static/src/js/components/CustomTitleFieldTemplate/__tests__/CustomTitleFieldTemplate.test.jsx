import React from 'react'
import { render, screen } from '@testing-library/react'

import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate'

const setup = (overrideProps = {}) => {
  const props = {
    required: false,
    title: 'Test Title',
    uiSchema: {},
    ...overrideProps
  }

  render(
    <CustomTitleFieldTemplate {...props} />
  )

  return {
    props
  }
}

describe('CustomTitleFieldTemplate', () => {
  describe('when a title field is not required', () => {
    test('renders it with no required icon', () => {
      setup()

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.queryByTitle('Test Title')).not.toBeInTheDocument()
    })
  })

  describe('when a title field is required', () => {
    test('renders it with the required icon', () => {
      setup({
        required: true
      })

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByTitle('Test Title').className).toContain('eui-icon eui-required-o required-icon')
    })
  })

  describe('when a title field is a custom UI title', () => {
    test('renders it with custom UI title', () => {
      setup({
        uiSchema: {
          options: {
            title: 'Custom UI Title'
          }
        }
      })

      expect(screen.getByText('Custom UI Title')).toBeInTheDocument()
    })
  })

  describe('when a title field with hide-header set to true', () => {
    test('renders it with no header', () => {
      setup({
        uiSchema: {
          'ui:hide-header': true
        }
      })

      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    })
  })
})
