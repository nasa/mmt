import React from 'react'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PaginationComponent from '../Pagination'

const setoffset = jest.fn()

const setup = () => {
  const props = {
    limit: 2,
    count: 14,
    setoffset
  }
  render(
    <PaginationComponent {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Pagination', () => {
  describe('when pagination component is passed count < limit', () => {
    test('renders pagination bar', () => {
      setup()

      expect(screen.queryAllByRole('button')).toHaveLength(3)

      // Check individual buttons work
      fireEvent.click(screen.getByRole('button', { name: '2' }))

      // Check the next button works
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))

      // // Click on Previous Page
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }))

      // // Check pages[0] always stays at 1 and two ellipsis render
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      expect(screen.getByRole('button', { name: '1' }))
      expect(screen.queryAllByText('More')).toHaveLength(2)

      // Make sure onclick for pages[0] function above works
      fireEvent.click(screen.getByRole('button', { name: '1' }))

      // Can click on last page
      fireEvent.click(screen.getByRole('button', { name: '7' }))
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
      expect(screen.queryAllByText('More')).toHaveLength(1)
    })
  })
})
