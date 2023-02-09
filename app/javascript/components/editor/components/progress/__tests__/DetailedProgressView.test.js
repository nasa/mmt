import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import {
  MemoryRouter, Route, Routes
} from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import DetailedProgressView from '../DetailedProgressView'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'

// eslint-disable-next-line import/no-unresolved
global.fetch = require('jest-fetch-mock')

async function mockFetch(url) {
  switch (url) {
    case '/api/tool_drafts/1': {
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
    expect(editor.draft.json.LongName).toEqual('a long name #1')
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-information_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__related-ur-ls_error')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__compatibility-and-usability_not-started')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__descriptive-keywords_not-started')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-organizations_not-started')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__tool-contacts_not-started')).toBeTruthy()
    expect(screen.queryByTestId('detailed-progress-view--progress-section__potential-action_not-started')).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  test('shows error if draft not found', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2']}>
        <Routes>
          <Route path="/tool_drafts/:id" element={<DetailedProgressView editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => null) // required otherwise the fetch for draft id 1 doesn't happen.
    expect(screen.getByText('error retrieving draft! Error code: 404')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
