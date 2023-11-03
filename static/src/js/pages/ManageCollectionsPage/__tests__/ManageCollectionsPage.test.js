import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import ManageCollectionsPage from '../ManageCollectionsPage'

describe('ManageCollectionsPage component', () => {
  test('renders the manage collections page', async () => {
    render(
      <BrowserRouter>
        <ManageCollectionsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('This is the page manage collections page content')).toBeInTheDocument()
  })
})
