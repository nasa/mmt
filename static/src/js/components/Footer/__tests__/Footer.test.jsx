import React from 'react'
import { render, screen } from '@testing-library/react'

import Footer from '../Footer'

describe('Footer component', () => {
  test('displays the version badge', async () => {
    render(<Footer />)

    expect(screen.getByText('vdevelopment')).toBeInTheDocument()
    expect(screen.getByText('vdevelopment')).toHaveClass('badge bg-dark')
  })

  describe('when an item does not have an href defined', () => {
    test('renders the item as a span', () => {
      render(<Footer />)

      expect(screen.getByText('NASA Official: Doug Newman').tagName).toBe('SPAN')
      expect(screen.getByText('NASA Official: Doug Newman').href).toBe(undefined)
    })
  })

  test('displays the NASA Official as text', async () => {
    render(<Footer />)

    expect(screen.getByText('NASA Official: Doug Newman')).toBeInTheDocument()
    expect(screen.getByText('NASA Official: Doug Newman').tagName).toBe('SPAN')
    expect(screen.getByText('NASA Official: Doug Newman').href).toBe(undefined)
  })

  test('displays the FOIA link', async () => {
    render(<Footer />)

    expect(screen.getByText('FOIA')).toBeInTheDocument()
    expect(screen.getByText('FOIA').tagName).toBe('A')
    expect(screen.getByText('FOIA')).toHaveAttribute('href', 'https://www.nasa.gov/FOIA/index.html')
  })

  test('displays the NASA Privacy Policy link', async () => {
    render(<Footer />)

    expect(screen.getByText('NASA Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('NASA Privacy Policy').tagName).toBe('A')
    expect(screen.getByText('NASA Privacy Policy')).toHaveAttribute('href', 'https://www.nasa.gov/about/highlights/HP_Privacy.html')
  })

  test('displays the USA.gov link', async () => {
    render(<Footer />)

    expect(screen.getByText('USA.gov')).toBeInTheDocument()
    expect(screen.getByText('USA.gov').tagName).toBe('A')
    expect(screen.getByText('USA.gov')).toHaveAttribute('href', 'https://www.usa.gov/')
  })
})
