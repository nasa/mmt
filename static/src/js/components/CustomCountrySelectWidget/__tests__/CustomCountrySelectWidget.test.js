import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomCountrySelectWidget from '../CustomCountrySelectWidget'

const setup = (overrideProps = {}) => {
  const props = {
    id: 'the-widget',
    label: 'MyTestDataLabel',
    required: false,
    onChange: jest.fn(),
    value: 'TZ',
    uiSchema: {},
    ...overrideProps
  }

  render(
    <CustomCountrySelectWidget {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('CustomCountrySelectWidget', () => {
  describe('when existing data has country', () => {
    test('renders the component with selected country ', () => {
      setup()

      expect(screen.getByText('My Test Data Label')).toBeInTheDocument()
      expect(screen.getByText('Tanzania, United Republic of').className).toContain('singleValue')

      expect(screen.queryByText('Select MyTestDataLabel')).not.toBeInTheDocument()
    })
  })

  describe('when title is given by uiSchema', () => {
    test('renders the component with title ', () => {
      setup({
        uiSchema: {
          'ui:title': 'Label From UISchema'
        }
      })

      expect(screen.getByText('Label From UISchema')).toBeInTheDocument()
    })
  })

  describe('when existing data has no country', () => {
    test('renders the component with no country selected ', () => {
      setup({
        value: ''
      })

      expect(screen.getByText('My Test Data Label')).toBeInTheDocument()
      expect(screen.getByText('Select MyTestDataLabel').className).toContain('placeholder')
    })
  })

  describe('when user select a country', () => {
    test('renders the component with the country selected ', async () => {
      const {
        user,
        props
      } = setup({
        value: ''
      })

      const select = screen.getByRole('combobox')
      await user.click(select)

      const option = screen.getByRole('option', { name: 'United States' })
      await user.click(option)

      expect(props.onChange).toHaveBeenCalledWith('US')
    })
  })
})
