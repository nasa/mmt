import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import MetadataEditor from '../../MetadataEditor'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditorForm from '../MetadataEditorForm'

describe('Error List test', () => {
  it('testing invalid field onClick', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    const field = screen.queryByTestId('error-list-item__Name is a required property')
    fireEvent.click(await field)
    expect(container).toHaveTextContent('The name of the downloadable tool or web user interface.')
    expect(container).toMatchSnapshot()
  })

  it('testing for controlled Field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    await act(async () => null)

    const clickField = screen.queryAllByTestId('error-list-item__URLContentType is a required property')[0]
    fireEvent.click(clickField)
  })
  it('testing array field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    const clickRelatedURLs = screen.queryByTestId('navigationitem--listgroup.item__related-ur-ls')
    fireEvent.click(await clickRelatedURLs)

    const addNewField = screen.queryByTestId('custom-array-template-add-btn').querySelector('button[type="button"]')
    fireEvent.click(await addNewField)

    const navigationitem = screen.queryByTestId('error-list-item__URLContentType is a required property')
    fireEvent.click(await navigationitem)
  })
})
