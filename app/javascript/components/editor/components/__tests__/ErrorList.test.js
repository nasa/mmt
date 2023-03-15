import React from 'react'
import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import MetadataEditor from '../../MetadataEditor'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditorForm from '../MetadataEditorForm'

describe('Error List test', () => {
  it('testing valid field onClick', async () => {
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    const field = screen.queryByTestId('error-list-item__name')
    fireEvent.click(await field)
    expect(container).toHaveTextContent('The name of the downloadable tool or web user interface.')
    expect(container).toMatchSnapshot()
  })

  it('testing for controlled Field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    await act(async () => null)

    const clickField = screen.queryAllByTestId('error-list-item__url')[0]
    fireEvent.click(clickField)
    expect(container).toMatchSnapshot()
  })

  it('testing array field', async () => {
    const model = new UmmToolsModel()
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const editor = new MetadataEditor(model)
    const { container } = render(

      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    const clickRelatedURLs = screen.queryByTestId('navigationitem--listgroup.item__related-ur-ls')
    fireEvent.click(await clickRelatedURLs)

    const addNewField = screen.queryByTestId('custom-array-template-add-btn').querySelector('button[type="button"]')
    fireEvent.click(await addNewField)

    const inputElement = screen.queryByTestId('custom-text-area-widget__description--text-area-input')
    userEvent.clear(inputElement)
    userEvent.type(inputElement, 'Cloudy day')

    await waitFor(async () => {
      screen.queryAllByTestId('error-list-item__url-content-type')[0].click()
    })

    expect(container).toMatchSnapshot()
  })
})
