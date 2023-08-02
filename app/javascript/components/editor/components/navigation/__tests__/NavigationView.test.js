import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import {
  MemoryRouter, Route, Routes
} from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import NavigationView from '../NavigationView'
import DetailedProgressView from '../../progress/DetailedProgressView'
import MetadataEditorForm from '../../MetadataEditorForm'

global.fetch = require('jest-fetch-mock')

global.scroll = jest.fn()

async function mockFetch(url) {
  switch (url) {
    case '/api/providers/MMT_1/tool_drafts': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name', LongName: 'a long name #1', Version: '1', Type: 'Web Portal'
          },
          id: 1,
          user_id: 9
        })
      }
    }
    case '/api/providers/MMT_1/tool_drafts/1': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name', LongName: 'a long name #1', Version: '1', Type: 'Web Portal'
          },
          id: 1,
          user_id: 9
        })
      }
    }
    case '/api/providers/MMT_1/tool_drafts/2': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name', LongName: 'a long name #2', Version: '2', Type: 'Web Portal'
          },
          id: 2,
          user_id: 9
        })
      }
    }
    default: {
      return {
        ok: false,
        status: 404
      }
    }
  }
}
const OLD_ENV = process.env

describe('Navigation View Component', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    window.fetch.mockImplementation(mockFetch)
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  beforeAll(() => jest.spyOn(window, 'fetch'))
  Window.prototype.metadataPreview = jest.fn()

  test('renders the navigation view', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <NavigationView editor={editor} />
      </MemoryRouter>
    )
    expect(screen.getByTestId('navigationitem--listgroup.item__tool-information')).toHaveTextContent('Tool Information')
    expect(screen.getByTestId('navigationitem--listgroup.item__related-ur-ls')).toHaveTextContent('Related URLs')
    expect(screen.getByTestId('navigationitem--listgroup.item__compatibility-and-usability')).toHaveTextContent('Compatibility And Usability')
    expect(screen.getByTestId('navigationitem--listgroup.item__descriptive-keywords')).toHaveTextContent('Descriptive Keywords')
    expect(screen.getByTestId('navigationitem--listgroup.item__tool-organizations')).toHaveTextContent('Tool Organization')
    expect(screen.getByTestId('navigationitem--listgroup.item__tool-contacts')).toHaveTextContent('Tool Contacts')
    expect(screen.getByTestId('navigationitem--listgroup.item__potential-action')).toHaveTextContent('Potential Action')

    expect(container).toMatchSnapshot()
  })

  test('saves draft', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <NavigationView editor={editor} />
      </MemoryRouter>
    )
    jest.spyOn(editor, 'saveDraft')
    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveButton = screen.queryByTestId('navigationview--save-draft-button')
    await act(async () => {
      saveButton.click()
    })
    expect(editor.saveDraft).toHaveBeenCalledTimes(1)
    expect(container).toMatchSnapshot()
  })

  test('saves and continues to next', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <NavigationView editor={editor} />
      </MemoryRouter>
    )
    const saveAndContinueButton = screen.queryByTestId('navigationview--save-and-continue-button')
    jest.spyOn(editor, 'saveDraft')
    await act(async () => {
      saveAndContinueButton.click()
    })
    expect(editor.saveDraft).toHaveBeenCalledTimes(1)
    expect(editor.currentSection.displayName).toEqual('Related URLs')
    expect(container).toMatchSnapshot()
  })

  test('saves and previews', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveAndPreviewButton = screen.queryByTestId('navigationview--save-and-preview')
    await act(async () => {
      saveAndPreviewButton.click()
    })
    expect(screen.getByText('Metadata Fields')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('saves and previews with error', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveAndPreviewButton = screen.queryByTestId('navigationview--save-and-preview')
    fetch.mockRejectedValueOnce(new Error('500 error'))

    await act(async () => {
      saveAndPreviewButton.click()
    })
    expect(screen.getByText('error saving draft! 500 error')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('saves but receives error', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveButton = screen.queryByTestId('navigationview--save-draft-button')
    fetch.mockRejectedValueOnce(new Error('500 error'))
    await act(async () => {
      saveButton.click()
    })
    expect(screen.getByText('error saving draft! 500 error')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('cancels changes', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    const cancelButton = screen.queryByTestId('navigationview--cancel-button')
    await act(async () => {
      cancelButton.click()
    })
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(editor.status).toEqual({ message: 'Changes discarded.', type: 'info' })
    expect(container).toMatchSnapshot()
  })

  test('error canceling changes', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    const cancelButton = screen.queryByTestId('navigationview--cancel-button')
    fetch.mockRejectedValueOnce(new Error('500 error'))
    await act(async () => {
      cancelButton.click()
    })
    expect(editor.status).toEqual({ message: 'Error cancelling. 500 error', type: 'warning' })
    expect(container).toMatchSnapshot()
  })
})
