import Form from '@rjsf/bootstrap-4'
import React from 'react'
import {
  render, fireEvent, screen, waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import validator from '@rjsf/validator-ajv8'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate'

const model = new UmmToolsModel()
const editor = new MetadataEditor(model)
const schema = {
  title: 'CustomArrayFieldTest',
  type: 'array',
  items: {
    properties: {
      firstName: {
        title: 'First Name',
        type: 'string'
      },
      lastName: {
        title: 'Last Name',
        type: 'string'
      },
      age: {
        title: 'Age',
        type: 'integer'
      }
    }
  }
}

const templates = {
  ArrayFieldTemplate: CustomArrayFieldTemplate
}
jest.useFakeTimers()
describe('Custom Array Template', () => {
  it('renders the custom array template and adds an array', async () => {
    const { getByTestId, container } = render(
      <BrowserRouter>
        <Form validator={validator} schema={schema} templates={templates} formContext={{ editor }} />
      </BrowserRouter>
    )
    const mockSetTimeout = jest.fn()
    const addNewField = getByTestId('custom-array-template-add-btn')
    HTMLElement.prototype.scrollIntoView = jest.fn()

    await waitFor(async () => {
      fireEvent.click(await addNewField)
    })

    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('First Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Last Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Age')

    const addAnotherNewField = getByTestId('custom-array-template-add-another-btn')
    await waitFor(async () => {
      fireEvent.click(await addAnotherNewField)
    })

    jest.runAllTimers(mockSetTimeout)

    expect(HTMLElement.prototype.scrollIntoView).toBeCalledTimes(2)
    const removeButtons = container.getElementsByClassName('custom-array-template-remove-btn')
    expect(removeButtons).toHaveLength(2)
    jest.runAllTimers(mockSetTimeout)

    expect(container).toMatchSnapshot()
  })
  it('renders the custom array template. 1.) Adds a field 2.) removes the added field', async () => {
    const { getByTestId, container } = render(
      <BrowserRouter>
        <Form validator={validator} schema={schema} templates={templates} formContext={{ editor }} />
      </BrowserRouter>
    )
    const addNewField = getByTestId('custom-array-template-add-btn')
    await waitFor(async () => {
      fireEvent.click(await addNewField)
      expect(screen.getByTestId('custom-array-element')).toHaveTextContent('First Name')
      expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Last Name')
      expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Age')

      const removeField = getByTestId('custom-array-template')

      fireEvent.click(await removeField)
    })

    expect(container).toMatchSnapshot()
  })
})
