import React from 'react'
import {
  render, screen, fireEvent, waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditorForm from '../../MetadataEditorForm'

global.scroll = jest.fn()

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
    await waitFor(async () => {
      const clickRelatedURLs = screen.queryByTestId('navigationitem--listgroup.item__related-ur-ls')
      fireEvent.click(await clickRelatedURLs)

      const addNewField = screen.queryByTestId('custom-array-template-add-btn')
      fireEvent.click(await addNewField)

      const inputElement = screen.queryByTestId('custom-text-area-widget__description--text-area-input')
      userEvent.clear(inputElement)
      userEvent.type(inputElement, 'Cloudy day')

      screen.queryAllByTestId('error-list-item__url-content-type')[0].click()
    })

    expect(container).toMatchSnapshot()
  })

  it('shows a gray circle for each error when a user first visits the section', async () => {
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )
    expect(screen.getByTestId('error-list-item__name--info')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('shows a red circle for each error when a user visits, moves off, then back to the section', async () => {
    const model = new UmmToolsModel()
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <BrowserRouter>
        <MetadataEditorForm editor={editor} />
      </BrowserRouter>
    )

    const nameField = screen.queryByTestId('custom-text-widget__name--text-input')

    await waitFor(async () => {
      fireEvent.focus(await nameField)
      fireEvent.blur(await nameField)
    })
    expect(screen.getByTestId('error-list-item__name--error')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
