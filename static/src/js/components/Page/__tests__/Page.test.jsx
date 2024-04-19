import React from 'react'
import { render, screen } from '@testing-library/react'

import Page from '../Page'

describe('Page component', () => {
  test('renders the header and children component', async () => {
    render(
      <Page header={<h1>Mock Header Component</h1>}>
        Mock Children component
      </Page>
    )

    expect(screen.getByText('Mock Header Component')).toBeInTheDocument()
    expect(screen.getByText('Mock Children component')).toBeInTheDocument()
  })
})
