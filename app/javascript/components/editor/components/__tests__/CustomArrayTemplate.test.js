import Form from '@rjsf/bootstrap-4'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CustomArrayTemplate from '../CustomArrayTemplate'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'

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

CustomArrayTemplate.defaultProps = { options: { editor } }

describe('Custom Array Template', () => {
  it('renders the custom array template and adds an array', async () => {
    const { getByTestId, container } = render(
      <BrowserRouter>
        <Form schema={schema} ArrayFieldTemplate={CustomArrayTemplate} />
      </BrowserRouter>
    )

    const addNewField = getByTestId('custom-array-template-add-btn').querySelector('button[type="button"]')

    fireEvent.click(await addNewField)

    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('First Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Last Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Age')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom array template. 1.) Adds a field 2.) removes the added field', async () => {
    const { getByTestId, container } = render(
      <BrowserRouter>
        <Form schema={schema} ArrayFieldTemplate={CustomArrayTemplate} />
      </BrowserRouter>
    )
    const addNewField = getByTestId('custom-array-template-add-btn').querySelector('button[type="button"]')

    fireEvent.click(await addNewField)
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('First Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Last Name')
    expect(screen.getByTestId('custom-array-element')).toHaveTextContent('Age')

    const removeField = getByTestId('custom-array-template').querySelector('button[type="button"]')

    fireEvent.click(await removeField)
    expect(container).toMatchSnapshot()
  })
})
