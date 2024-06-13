import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import PrimaryNavigationLink from '../PrimaryNavigationLink'

const setup = ({
  overrideProps = {}
} = {}) => {
  render(
    <BrowserRouter>
      <PrimaryNavigationLink
        to="/collections"
        title="All Collections"
        {...overrideProps}
      />
    </BrowserRouter>
  )
}

describe('PrimaryNavigationLink', () => {
  test('renders a link inside a list item', () => {
    setup()

    const listitem = screen.getByRole('listitem')

    expect(listitem).toBeInTheDocument()

    expect(within(listitem).getByRole('link')).toBeDefined()
    expect(within(listitem).getByRole('link')).toHaveAttribute('href', '/collections')
  })

  describe('when a tabIndex is defined', () => {
    test('adds a tabIndex', () => {
      setup({
        overrideProps: {
          tabIndex: '0'
        }
      })

      expect(screen.getByRole('link')).toBeDefined()
      expect(screen.getByRole('link')).toHaveAttribute('tabindex', '0')
    })
  })

  describe('when a visible is false', () => {
    test('does not display a listitem', () => {
      setup({
        overrideProps: {
          visible: false
        }
      })

      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })

  describe('when a version is defined', () => {
    test('adds a version', () => {
      setup({
        overrideProps: {
          version: 'v1'
        }
      })

      expect(screen.getByText('v1')).toBeInTheDocument()
    })
  })
})
