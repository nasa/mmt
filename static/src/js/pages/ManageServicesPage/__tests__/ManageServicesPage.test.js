import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ManageServicesPage from '../ManageServicesPage'

describe('ManageServicesPage component', () => {
  test('renders the manage services page', async () => {
    render(
      <BrowserRouter>
        <ManageServicesPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage services page content')).toBeInTheDocument()
  })
})
