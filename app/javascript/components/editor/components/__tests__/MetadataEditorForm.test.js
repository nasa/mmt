/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import {
  MemoryRouter, Route, Routes
} from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'
import MetadataEditorForm from '../MetadataEditorForm'

global.fetch = require('jest-fetch-mock')

async function mockFetch(url) {
  switch (url) {
    case '/api/tool_drafts/': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name', LongName: 'a long name #new', Version: '1', Type: 'Web Portal'
          },
          id: 2,
          user_id: 9
        })
      }
    }
    case '/api/tool_drafts/1': {
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
    case '/api/tool_drafts/2': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name', LongName: 'a long name #2', Version: '1', Type: 'Web Portal'
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

describe('UMM Tools Form', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    window.fetch.mockImplementation(mockFetch)
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  beforeAll(() => jest.spyOn(window, 'fetch'))

  test('renders tool draft 1', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(editor.draft.json.LongName).toEqual('a long name #1')
    expect(container).toMatchSnapshot()
  })

  test('renders a new tool draft', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/new']}>
        <Routes>
          <Route path="/tool_drafts/new" element={<MetadataEditorForm editor={editor} />} />
          <Route path="/tool_drafts/:id" element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(editor.draft.json.LongName).toEqual('a long name #new')
    expect(container).toMatchSnapshot()
  })

  test('renders a tool draft with error', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/3']}>
        <Routes>
          <Route path="/tool_drafts/new" element={<MetadataEditorForm editor={editor} />} />
          <Route path="/tool_drafts/:id" element={<MetadataEditorForm editor={editor} />} />
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(screen.getByText('error retrieving draft! Error code: 404')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
  test('renders new tool draft with error', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    fetch.mockRejectedValueOnce(new Error('500 error'))
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/new']}>
        <Routes>
          <Route path="/tool_drafts/new" element={<MetadataEditorForm editor={editor} />} />
          <Route path="/tool_drafts/:id" element={<MetadataEditorForm editor={editor} />} />
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(screen.getByText('error saving draft! 500 error')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
