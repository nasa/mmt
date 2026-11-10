import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import BulkActionsTaskPage from '../BulkActionsTaskPage'

describe('BulkActionsTaskPage component', () => {
  test('renders the task id from the url', () => {
    render(
      <MemoryRouter initialEntries={['/collections/bulk-actions/BU-4439']}>
        <Routes>
          <Route path="/:type/bulk-actions/:taskId" element={<BulkActionsTaskPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Bulk Action Task: BU-4439' })).toBeInTheDocument()
    expect(screen.getByText(/Task BU-4439 was submitted/)).toBeInTheDocument()
  })

  test('links the Bulk Actions breadcrumb back to this concept type\'s landing page', () => {
    render(
      <MemoryRouter initialEntries={['/collections/bulk-actions/BU-4439']}>
        <Routes>
          <Route path="/:type/bulk-actions/:taskId" element={<BulkActionsTaskPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Bulk Actions' })).toHaveAttribute('href', '/collections/bulk-actions')
  })
})
