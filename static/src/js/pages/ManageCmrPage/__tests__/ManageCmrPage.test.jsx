import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ManageCmrPage from '../ManageCmrPage'

describe('ManageCmrPage component', () => {
  test('renders the manage CMR page', async () => {
    render(
      <BrowserRouter>
        <ManageCmrPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage CMR page content')).toBeInTheDocument()
  })
})
