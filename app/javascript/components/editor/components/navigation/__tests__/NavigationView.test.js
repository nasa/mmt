import React from 'react'
import {
  render, screen, waitFor
} from '@testing-library/react'
import {
  MemoryRouter, Route, Routes
} from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import nock from 'nock'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import NavigationView from '../NavigationView'
import DetailedProgressView from '../../progress/DetailedProgressView'
import MetadataEditorForm from '../../MetadataEditorForm'

global.scroll = jest.fn()

describe('Navigation View Component', () => {
  Window.prototype.metadataPreview = jest.fn()

  beforeAll(() => {
    nock.cleanAll()

    nock('http://localhost')
      .persist()
      .get('/api/providers/MMT_1/tool_drafts/1')
      .reply(200, {
        items: [{
          umm: {
            Name: 'a name',
            LongName: 'foobar',
            Version: '1',
            Type: 'Web Portal',
            RelatedURLs: [
              {
                Description: 'Test',
                URLContentType: 'PublicationURL',
                Type: 'VIEW RELATED INFORMATION',
                URL: 'https://earthdata.nasa.gov/'
              }
            ]
          },
          meta: {
            'native-id': '1',
            'user-id': 'chris.gokey'
          }
        }]
      })

    nock('http://localhost')
      .persist()
      .get('/api/providers/MMT_1/tool_drafts/2')
      .reply(200, {
        items: [{
          umm: {
            Name: 'a name',
            LongName: 'foobar',
            Version: '2',
            Type: 'Web Portal',
            RelatedURLs: [
              {
                Description: 'Test',
                URLContentType: 'PublicationURL',
                Type: 'VIEW RELATED INFORMATION',
                URL: 'https://earthdata.nasa.gov/'
              }
            ]
          },
          meta: {
            'native-id': '1',
            'user-id': 'chris.gokey'
          }
        }]
      })

    nock('http://localhost')
      .persist()
      .get(/\/api\/cmr_keywords\/.*/)
      .reply(200, {})
  })

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
    nock('http://localhost')
      .put('/api/providers/MMT_1/tool_drafts/1')
      .reply(200, {})

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

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    jest.spyOn(editor, 'ingestDraft')
    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveButton = screen.queryByTestId('navigationview--save-draft-button')
    await act(async () => {
      saveButton.click()
    })
    expect(editor.ingestDraft).toHaveBeenCalledTimes(1)
    expect(container).toMatchSnapshot()
  })

  test('saves and continues to next', async () => {
    nock('http://localhost')
      .put('/api/providers/MMT_1/tool_drafts/1')
      .reply(200, {})

    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })
    jest.spyOn(editor, 'ingestDraft')

    await act(async () => {
      const saveAndContinueButton = screen.queryByTestId('navigationview--save-and-continue-button')
      saveAndContinueButton.click()
    })

    await waitFor(() => {
      expect(editor.ingestDraft).toHaveBeenCalledTimes(1)
      expect(editor.currentSection.displayName).toEqual('Related URLs')
    })
    expect(container).toMatchSnapshot()
  })

  test('saves and previews', async () => {
    nock('http://localhost')
      .put('/api/providers/MMT_1/tool_drafts/1')
      .reply(200, {})

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

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    jest.spyOn(editor, 'ingestDraft')

    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })

    const saveAndPreviewButton = screen.queryByTestId('navigationview--save-and-preview')
    await act(async () => {
      saveAndPreviewButton.click()
    })

    await waitFor(() => {
      expect(editor.ingestDraft).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Metadata Fields')).toBeInTheDocument()
    })
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

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    jest.spyOn(editor, 'ingestDraft')

    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })

    nock('http://localhost')
      .put('/api/providers/MMT_1/tool_drafts/1')
      .reply(500, {})

    const saveAndPreviewButton = screen.queryByTestId('navigationview--save-and-preview')
    await act(async () => {
      saveAndPreviewButton.click()
    })

    await waitFor(() => {
      expect(editor.ingestDraft).toHaveBeenCalledTimes(1)
      expect(screen.getByText('error saving draft! Error code: 500')).toBeInTheDocument()
    })

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

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    await act(async () => {
      screen.queryByTestId('navigationview--dropdown-toggle').click()
    })
    const saveButton = screen.queryByTestId('navigationview--save-draft-button')

    nock('http://localhost')
      .put('/api/providers/MMT_1/tool_drafts/2')
      .reply(500, {})

    await act(async () => {
      saveButton.click()
    })
    await waitFor(() => {
      expect(screen.getByText('error saving draft! Error code: 500')).toBeInTheDocument()
    })
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

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    const cancelButton = screen.queryByTestId('navigationview--cancel-button')
    await act(async () => {
      cancelButton.click()
    })

    await waitFor(() => {
      expect(editor.status).toEqual({ message: 'Changes discarded.', type: 'info' })
    })

    expect(container).toMatchSnapshot()
  })

  test('error canceling changes', async () => {
    nock('http://localhost')
      .get('/api/providers/MMT_1/tool_drafts/3')
      .reply(200, {
        items: [{
          umm: {
            Name: 'a name',
            LongName: 'foobar',
            Version: '1',
            Type: 'Web Portal',
            RelatedURLs: [
              {
                Description: 'Test',
                URLContentType: 'PublicationURL',
                Type: 'VIEW RELATED INFORMATION',
                URL: 'https://earthdata.nasa.gov/'
              }
            ]
          },
          meta: {
            'native-id': '1',
            'user-id': 'chris.gokey'
          }
        }]
      })

    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/3/edit/Tool_Information']}>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('custom-text-widget__long-name--text-input')).toHaveValue('foobar')
    })

    nock('http://localhost')
      .get('/api/providers/MMT_1/tool_drafts/3')
      .reply(500, {})

    const cancelButton = screen.queryByTestId('navigationview--cancel-button')
    await act(async () => {
      cancelButton.click()
    })

    await waitFor(() => {
      expect(editor.status).toEqual({ message: 'Error cancelling. Error code: 500', type: 'warning' })
    })
    expect(container).toMatchSnapshot()
  })
})
