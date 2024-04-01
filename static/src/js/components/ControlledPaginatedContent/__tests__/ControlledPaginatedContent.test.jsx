import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ControlledPaginatedContent from '../ControlledPaginatedContent'

vi.mock('react-icons/fa')

const setup = (overrideProps = {}) => {
  const props = {
    activePage: 1,
    count: 99,
    limit: 25,
    setPage: vi.fn(),
    ...overrideProps
  }

  render(
    <ControlledPaginatedContent {...props}>
      {
        ({
          pagination,
          totalPages,
          firstResultPosition,
          lastResultPosition
        }) => (
          <div data-testid="controlled-paginated-content-child">
            {pagination}
            <span>{`Total Pages: ${totalPages}`}</span>
            <span>{`First Result: ${firstResultPosition}`}</span>
            <span>{`Last Result: ${lastResultPosition}`}</span>
          </div>
        )
      }
    </ControlledPaginatedContent>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('ControlledPaginatedContent', () => {
  describe('when rendering the first page', () => {
    test('calculates the total pages', () => {
      setup()

      expect(screen.queryByText('Total Pages: 4')).toBeInTheDocument()
    })

    test('calculates the first result', () => {
      setup()

      expect(screen.queryByText('First Result: 1')).toBeInTheDocument()
    })

    test('calculates the last position', () => {
      setup()

      expect(screen.queryByText('Last Result: 25')).toBeInTheDocument()
    })

    test('generates the pagination correctly', () => {
      setup()

      const buttons = screen.queryAllByRole('button', { disabled: true })

      expect(buttons.length).toEqual(3)
      expect(buttons.at(0).textContent).toEqual('2')
      expect(buttons.at(1).textContent).toEqual('4')
      expect(buttons.at(2).textContent).toEqual('›Next')
    })
  })

  describe('when rendering the last page', () => {
    test('calculates the first result', () => {
      setup({
        activePage: 4
      })

      expect(screen.queryByText('First Result: 76')).toBeInTheDocument()
    })

    test('calculates the last position', () => {
      setup({
        activePage: 4
      })

      expect(screen.queryByText('Last Result: 99')).toBeInTheDocument()
    })

    test('generates the pagination correctly', () => {
      setup({
        activePage: 4
      })

      const buttons = screen.queryAllByRole('button', { disabled: true })

      expect(buttons.length).toEqual(3)
      expect(buttons.at(0).textContent).toEqual('‹Previous')
      expect(buttons.at(1).textContent).toEqual('1')
      expect(buttons.at(2).textContent).toEqual('3')
    })
  })

  describe('when clicking pagination', () => {
    test('calls setPage with the correct page', async () => {
      const setPageMock = vi.fn()

      const { user } = setup({
        setPage: setPageMock
      })

      const buttons = screen.queryAllByRole('button', { disabled: true })

      await user.click(buttons.at(2))

      expect(setPageMock).toHaveBeenCalledTimes(1)
      expect(setPageMock).toHaveBeenCalledWith(2)
    })
  })
})
