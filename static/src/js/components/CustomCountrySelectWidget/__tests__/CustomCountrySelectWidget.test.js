import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import CustomCountrySelectWidget from '../CustomCountrySelectWidget'

const setup = (overrideProps = {}) => {
  const onChange = jest.fn()
  const props = {
    id: 'the-widget',
    label: 'MyTestDataLabel',
    required: false,
    onChange,
    value: 'TZ',
    uiSchema: {},
    ...overrideProps
  }

  const component = render(
    <BrowserRouter>
      <CustomCountrySelectWidget {...props} />
    </BrowserRouter>
  )

  return {
    component,
    props,
    user: userEvent.setup()
  }
}

describe('CustomCountrySelectWidget', () => {
  describe('when existing data has country', () => {
    test('renders the component with selected country ', () => {
      const { component } = setup()
      expect(component.container).toHaveTextContent('My Test Data Label')
      const theWidget = component.container.querySelector('#the-widget')
      expect(theWidget).not.toHaveTextContent('Select MyTestDataLabel')
      expect(theWidget).toHaveTextContent('Tanzania, United Republic of')
      const inputField = screen.getByRole('combobox')
      expect(inputField).toHaveAttribute('role', 'combobox')
      expect(inputField).toHaveAttribute('type', 'text')
      expect(inputField).toHaveAttribute('spellcheck', 'false')
    })
  })

  describe('when title is given by uiSchema', () => {
    test('renders the component with title ', () => {
      const { component } = setup({
        uiSchema: {
          'ui:title': 'Label From UISchema'
        }
      })
      expect(component.container).toHaveTextContent('Label From UISchema')
      expect(component.container).not.toHaveTextContent('My Test Data Label')
      const theWidget = component.container.querySelector('#the-widget')
      expect(theWidget).not.toHaveTextContent('Select MyTestDataLabel')
      expect(theWidget).toHaveTextContent('Tanzania, United Republic of')
    })
  })

  describe('when existing data has no country', () => {
    test('renders the component with no country selected ', () => {
      const { component } = setup({
        value: ''
      })
      const theWidget = component.container.querySelector('#the-widget')
      expect(theWidget).toHaveTextContent('Select MyTestDataLabel')
      expect(theWidget).not.toHaveTextContent('Tanzania, United Republic of')
    })
  })

  describe('when user select a country', () => {
    test('renders the component with the country selected ', async () => {
      const {
        user,
        component,
        props
      } = setup({
        value: ''
      })
      const theWidget = component.container.querySelector('#the-widget')
      expect(theWidget).toHaveTextContent('Select MyTestDataLabel')
      const inputField = screen.getByRole('combobox')
      await user.click(inputField, { key: 'ArrowDown' })
      await user.click(screen.getByText('United States'))
      expect(props.onChange).toHaveBeenCalledWith('US')
    })
  })
})
