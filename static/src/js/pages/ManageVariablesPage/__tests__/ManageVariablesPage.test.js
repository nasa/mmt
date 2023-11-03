import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ManageVariablesPage from '../ManageVariablesPage'

describe('ManageVariablesPage component', () => {
  test('renders the manage variables page', async () => {
    render(
      <BrowserRouter>
        <ManageVariablesPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage variables page content')).toBeInTheDocument()
  })
})
