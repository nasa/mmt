import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ToolDraftsPage from '../ToolDraftsPage'

describe('ToolDraftsPage component', () => {
  test('renders the manage tools page', async () => {
    render(
      <BrowserRouter>
        <ToolDraftsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage tools page content')).toBeInTheDocument()
  })
})
