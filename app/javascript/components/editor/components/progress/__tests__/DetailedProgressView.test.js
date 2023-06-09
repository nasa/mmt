import React from 'react'
import {
  fireEvent,
  render, screen, waitFor
} from '@testing-library/react'
import {
  MemoryRouter, Route, Routes
} from 'react-router-dom'

import { act } from 'react-dom/test-utils'
import DeleteDraftView from '../../deleteView/DeleteDraftView'
import DetailedProgressView from '../DetailedProgressView'

import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditorForm from '../../MetadataEditorForm'
// eslint-disable-next-line import/no-unresolved
global.fetch = require('jest-fetch-mock')

async function mockFetch(url) {
  switch (url) {
    case '/api/providers/MMT_1/tool_drafts/1': {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          draft: {
            Name: 'a name',
            LongName: 'a long name #1',
            Version: '1',
            Type: 'Web Portal',
            RelatedURLs: [{
              URLContentType: 'Collection URL', Type: 'EXTENDED METADATA', URL: 'sddfsdfsdfs', Description: 'desc'
            },
            { Description: 'dssfadsdfadafs' }]
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
            Name: 'mock name for tool draft 2',
            LongName: 'mock long name',
            Version: '2',
            Type: 'Downloadable Tool',
            Description: 'mock description',
            URL: {
              Description: 'mock url',
              URLContentType: 'DistributionURL',
              Type: 'DOWNLOAD SOFTWARE',
              URLValue: 'mock URL Value',
              Subtype: 'MOBILE APP'
            },
            ToolKeywords: [
              {
                ToolCategory: 'EARTH SCIENCE SERVICES',
                ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
                ToolTerm: 'CALIBRATION/VALIDATION'
              }
            ],
            Organizations: [
              {
                Roles: [
                  'DEVELOPER'
                ],
                ShortName: 'ESA/ED',
                LongName: 'Educational Office, Ecological Society of America',
                URLValue: 'http://www.esa.org/education/'
              }
            ]
          },
          id: 2,
          user_id: 10
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

describe('Detailed Progress View', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    window.fetch.mockImplementation(mockFetch)
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  beforeAll(() => jest.spyOn(window, 'fetch'))
  Window.prototype.metadataPreview = jest.fn()

  test('renders tool draft 1 and tests section progress circles', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<DetailedProgressView editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(editor.draft.draft.LongName).toEqual('a long name #1')
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-information_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__related-ur-ls_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__compatibility-and-usability_pass')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__descriptive-keywords_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-organizations_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-contacts_pass')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__potential-action_pass')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('shows error if draft not found', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/3']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<DetailedProgressView editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 3 doesn't happen.
    expect(screen.getByText('Error retrieving draft! Error code: 404')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('show error when publishing incomplete draft', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/1']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<DetailedProgressView editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fect for draft 2 doesn't happen.
    const publishButton = screen.queryByTestId('detailed-progress-view-publish-draft-btn')
    await act(async () => {
      publishButton.click()
    })
    expect(editor.status).toEqual({ message: 'error publishing draft!', type: 'warning' })
    expect(container).toMatchSnapshot()
  })

  test('testing deleting a draft', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    const { baseElement } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<DetailedProgressView editor={editor} />} />
          <Route path="/tool_drafts/draftDeleted" element={<DeleteDraftView editor={editor} />} />
          <Route path="/tool_drafts/new" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fect for draft 2 doesn't happen.

    const deleteButton = screen.queryByTestId('detailed-progress-view-delete-draft-btn')
    await waitFor(() => {
      deleteButton.click()
    })

    await act(async () => {
      fireEvent.click(screen.queryByTestId('delete-modal-yes-button'))
    })
    expect(editor.status).toEqual({ message: 'Draft Deleted', type: 'success' })

    expect(screen.getByText('Draft Deleted')).toBeInTheDocument()

    // const createNewDaft = screen.queryByTestId('create-new-draft')
    await act(async () => {
      fireEvent.click(screen.queryByTestId('create-new-draft'))
    })
    expect(baseElement).toMatchSnapshot()
  })
})
