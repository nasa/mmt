import {
  fireEvent, render, screen
} from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import JSONView from '../components/JSONView'
import MetadataEditor from '../MetadataEditor'
import UmmToolsModel from '../model/UmmToolsModel'

describe('JSON View', () => {
  it('renders the JSON View with correct data', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      Name: 'JSON VIEW TEST',
      LongName: 'long name',
      Version: '1'
    }
    const editor = new MetadataEditor(model)
    const props = {
      editor
    }
    const { container, getByTestId } = render(
      <BrowserRouter>
        <JSONView {...props} />
      </BrowserRouter>
    )
    expect(getByTestId('json-view__full-data')).toHaveTextContent('{ "Name": "JSON VIEW TEST", "LongName": "long name", "Version": "1" }')
    expect(container).toMatchSnapshot()
  })

  it('testing Accordion Toggle', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      Name: 'JSON VIEW TEST',
      LongName: 'long name',
      Version: '1'
    }
    const editor = new MetadataEditor(model)
    const props = {
      editor
    }
    const { container } = render(
      <BrowserRouter>
        <JSONView {...props} />
      </BrowserRouter>
    )
    const accordionBtn = screen.getByTestId('json-view__accordion-header')

    // closes the accordion
    fireEvent.click(await accordionBtn)

    // opens the accordion
    fireEvent.click(await accordionBtn)
    expect(container).toMatchSnapshot()
  })
})
