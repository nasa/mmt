import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ToolDraftsPage from '../ToolDraftsPage'

import DraftList from '../../../components/DraftList/DraftList'

jest.mock('../../../components/DraftList/DraftList')

describe('ToolDraftsPage component', () => {
  test('renders the tool drafts routes page', async () => {
    render(
      <BrowserRouter>
        <ToolDraftsPage />
      </BrowserRouter>
    )

    // Renders the default route
    expect(DraftList).toHaveBeenCalledTimes(1)
  })
})
