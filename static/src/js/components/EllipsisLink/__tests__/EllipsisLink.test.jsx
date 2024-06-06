import { render, screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import EllipsisLink from '../EllipsisLink'

const setup = (overrideProps) => {
  const props = {
    to: '/collection/C-TEST',
    children: 'Cell data',
    ...overrideProps
  }

  const { container } = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<EllipsisLink {...props} />} />
        <Route path="/collection/C-TEST" element={<>Collection Page</>} />
      </Routes>
    </BrowserRouter>
  )

  return {
    container,
    props
  }
}

describe('EllipsisLink', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  describe('when cell data is not provided', () => {
    test('renders the cell data', () => {
      const { container } = setup({
        children: ''
      })

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when cell data is provided', () => {
    test('renders the cell data', () => {
      setup()

      expect(screen.getByText('Cell data')).toBeInTheDocument()
    })
  })

  describe('when clicking the link', () => {
    test('renders the cell data', async () => {
      const user = userEvent.setup()
      setup()

      const link = screen.getByRole('link', { name: 'Cell data' })

      await user.click(link)

      expect(screen.getByText('Collection Page')).toBeInTheDocument()
    })
  })

  describe('when rendering a long string', () => {
    beforeEach(() => {
      Object.defineProperty(Element.prototype, 'scrollWidth', {
        value: 100,
        writable: true,
        configurable: true
      })

      Object.defineProperty(Element.prototype, 'offsetWidth', {
        value: 75,
        writable: true,
        configurable: true
      })
    })

    afterEach(() => {
      Object.defineProperty(Element.prototype, 'scrollWidth', {
        value: 0,
        writable: true,
        configurable: true
      })

      Object.defineProperty(Element.prototype, 'offsetWidth', {
        value: 0,
        writable: true,
        configurable: true
      })
    })

    test('truncates and displays a tooltip with the whole text', async () => {
      const user = userEvent.setup()

      setup({
        children: 'This is a really really long cell data string'
      })

      const cell = screen.getByText('This is a really really long cell data string')

      await user.hover(cell)

      expect(cell).toBeInTheDocument()
    })
  })
})
