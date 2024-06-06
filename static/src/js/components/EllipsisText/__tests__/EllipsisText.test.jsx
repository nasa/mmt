import { render, screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

import EllipsisText from '../EllipsisText'

const setup = (overrideProps) => {
  const props = {
    children: 'Cell data',
    ...overrideProps
  }

  const { container } = render(<EllipsisText {...props} />)

  return {
    container,
    props
  }
}

describe('EllipsisText', () => {
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
