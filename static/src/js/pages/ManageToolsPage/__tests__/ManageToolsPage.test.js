import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ManageToolsPage from '../ManageToolsPage'

describe('ManageToolsPage component', () => {
  test('renders the manage tools page', async () => {
    render(
      <BrowserRouter>
        <ManageToolsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage tools page content')).toBeInTheDocument()
  })
})
