import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import Header from '../Header'

describe('Header component', () => {
  test('displays the NASA Earthdata MMT logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText('Metadata Management Tool')).toBeInTheDocument()
    expect(screen.getByText('Metadata Management Tool')).toHaveClass('nasa')
    expect(screen.getByText('Metadata Management Tool').textContent).toEqual('EarthdataMetadata Management Tool')
  })

  test('displays the user name badge', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText('Hi, User')).toBeInTheDocument()
    expect(screen.getByText('Hi, User').className).toContain('badge')
    expect(screen.getByText('Hi, User').className).toContain('bg-blue-light')
  })

  test('displays the search form', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Search MMT')
  })

  test('displays the search submit button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: 'Search Collections' })).toBeInTheDocument()
  })

  test('does not display the search options dropdown', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    expect(screen.getByText('Search collections')).not.toHaveClass('show')
  })

  describe('when the search submit dropdown button is clicked', () => {
    test('displays the search submit button', async () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )

      const searchOptionsButton = screen.getByRole('button', { name: 'Search Options' })

      await userEvent.click(searchOptionsButton)

      expect(screen.getByText('Search collections')).toHaveClass('show')
    })
  })
})
