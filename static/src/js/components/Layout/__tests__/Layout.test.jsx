import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import Layout from '../Layout'

vi.mock('../../Header/Header', () => ({
  __esModule: true,
  default: () => (
    <div>Header</div>
  )
}))

vi.mock('../../Footer/Footer', () => ({
  __esModule: true,
  default: () => (
    <div>Footer</div>
  )
}))

describe('Layout component', () => {
  test('renders the content to the React Router Outlet', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                (
                  <>
                    This is some content
                  </>
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    )

    expect(screen.getByText('This is some content')).toBeInTheDocument()
  })

  test('renders the footer', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                (
                  <>
                    This is some content
                  </>
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    )

    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  test('renders the header', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                (
                  <>
                    This is some content
                  </>
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    )

    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})
