import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'
import StreetAddressesField from '../StreetAddresseField'

describe('StreetAddressFieldTest', () => {
  it('basic test', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const props = {
      schema: {
        maxLength: 80,
        description: 'The street address description'
      },
      registry: {
        formContext: { editor }
      },
      onChange: mockedOnChange,
      formData: ['my first line', 'my second line', 'my third line']
    }
    const { container } = render(
      <BrowserRouter>
        <StreetAddressesField {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('street-address-field__title')).toHaveTextContent('The street address description')
    expect(screen.getByTestId('custom-text-widget__address-line-1--text-input')).toHaveValue('my first line')
    expect(screen.getByTestId('custom-text-widget__address-line-2--text-input')).toHaveValue('my second line')
    expect(screen.getByTestId('custom-text-widget__address-line-3--text-input')).toHaveValue('my third line')
    expect(container).toMatchSnapshot()
  })

  it('basic test with empty form data array', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const props = {
      schema: {
        maxLength: 80,
        description: 'The street address description'
      },
      registry: {
        formContext: { editor }
      },
      onChange: mockedOnChange,
      formData: []
    }
    const { container } = render(
      <BrowserRouter>
        <StreetAddressesField {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('street-address-field__title')).toHaveTextContent('The street address description')
    expect(screen.getByTestId('custom-text-widget__address-line-1--text-input')).toHaveValue('')
    expect(screen.getByTestId('custom-text-widget__address-line-2--text-input')).toHaveValue('')
    expect(screen.getByTestId('custom-text-widget__address-line-3--text-input')).toHaveValue('')
    expect(container).toMatchSnapshot()
  })

  it('basic test with no form data array', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const props = {
      schema: {
        maxLength: 80,
        description: 'The street address description'
      },
      registry: {
        formContext: { editor }
      },
      onChange: mockedOnChange
    }
    const { container } = render(
      <BrowserRouter>
        <StreetAddressesField {...props} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('street-address-field__title')).toHaveTextContent('The street address description')
    expect(screen.getByTestId('custom-text-widget__address-line-1--text-input')).toHaveValue('')
    expect(screen.getByTestId('custom-text-widget__address-line-2--text-input')).toHaveValue('')
    expect(screen.getByTestId('custom-text-widget__address-line-3--text-input')).toHaveValue('')
    expect(container).toMatchSnapshot()
  })

  it('bubbles up changes.', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const props = {
      schema: {
        maxLength: 80,
        description: 'The street address description'
      },
      registry: {
        formContext: { editor }
      },
      onChange: mockedOnChange,
      formData: ['my first line', 'my second line', 'my third line']
    }
    const { container } = render(
      <BrowserRouter>
        <StreetAddressesField {...props} />
      </BrowserRouter>
    )
    const inputElement = screen.getByTestId('custom-text-widget__address-line-1--text-input')

    userEvent.clear(inputElement)
    userEvent.type(inputElement, 'Cloudy day')
    expect(inputElement.value).toBe('Cloudy day')
    expect(mockedOnChange).toBeCalledTimes(11)
    expect(mockedOnChange).toBeCalledWith(['Cloudy day', 'my second line', 'my third line'])

    const inputElement2 = screen.getByTestId('custom-text-widget__address-line-2--text-input')
    userEvent.clear(inputElement2)

    const inputElement3 = screen.getByTestId('custom-text-widget__address-line-3--text-input')
    userEvent.clear(inputElement3)
    userEvent.type(inputElement3, 'Sunny day')

    expect(mockedOnChange).toBeCalledTimes(22)
    expect(mockedOnChange).toBeCalledWith(['Cloudy day', 'Sunny day'])

    expect(container).toMatchSnapshot()
  })
})
