import React from 'react'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Pagination from '../Pagination'

const setup = (overrideProps) => {
  const props = {
    setPage: jest.fn(),
    activePage: 1,
    totalPages: 3,
    ...overrideProps
  }

  render(
    <Pagination {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when the number of pages is less than 4', () => {
    test('renders the buttons', () => {
      setup()

      const buttons = screen.queryAllByRole('button')

      expect(buttons).toHaveLength(3)
      expect(buttons[0]).toHaveTextContent('2')
      expect(buttons[1]).toHaveTextContent('3')
      expect(buttons[2]).toHaveTextContent('›Next')
    })
  })

  describe('when the number of pages is greater than 4', () => {
    test('renders buttons and ellipsis', () => {
      setup({
        totalPages: 4
      })

      const buttons = screen.queryAllByRole('button')

      expect(buttons).toHaveLength(3)
      expect(buttons[0]).toHaveTextContent('2')
      expect(buttons[1]).toHaveTextContent('4')
      expect(buttons[2]).toHaveTextContent('›Next')
    })

    describe('when on the last page', () => {
      test('renders the buttons correctly', () => {
        setup({
          activePage: 7,
          totalPages: 7
        })

        const buttons = screen.queryAllByRole('button')

        expect(buttons).toHaveLength(3)
        expect(buttons[0]).toHaveTextContent('‹Previous')
        expect(buttons[1]).toHaveTextContent('1')
        expect(buttons[2]).toHaveTextContent('6')
      })
    })

    describe('when clicking the first page button', () => {
      test('calls setPage with the correct value', async () => {
        const user = userEvent.setup()
        const { props } = setup({
          activePage: 7,
          totalPages: 7
        })

        const buttons = screen.queryAllByRole('button')

        await user.click(buttons[1])

        expect(props.setPage).toHaveBeenCalledTimes(1)
        expect(props.setPage).toHaveBeenCalledWith(1)
      })
    })

    describe('with the next to last page selected', () => {
      describe('when clicking the last page button', () => {
        test('calls setPage with the correct value', async () => {
          const user = userEvent.setup()
          const { props } = setup({
            activePage: 1,
            totalPages: 7
          })

          const buttons = screen.queryAllByRole('button')

          await user.click(buttons[1])

          expect(props.setPage).toHaveBeenCalledTimes(1)
          expect(props.setPage).toHaveBeenCalledWith(7)
        })
      })
    })
  })

  describe('with the first page selected', () => {
    test('renders the previous button as disabled', () => {
      setup()

      const previousButton = screen.queryByText('Previous', { hidden: true })

      expect(previousButton.parentElement.parentElement).toHaveClass('disabled')
    })

    test('renders the current page item as active', () => {
      setup()

      const firstPageButton = screen.queryByText('1')

      expect(firstPageButton.parentElement).toHaveClass('active')
    })
  })

  describe('when clicking a page item', () => {
    test('calls setPage with the page number', async () => {
      const user = userEvent.setup()
      const { props } = setup()

      const buttons = screen.queryAllByRole('button')

      await user.click(buttons[0])

      expect(props.setPage).toHaveBeenCalledTimes(1)
      expect(props.setPage).toHaveBeenCalledWith(2)
    })
  })

  describe('when clicking the next page button', () => {
    test('calls setPage with the correct page number', async () => {
      const user = userEvent.setup()
      const { props } = setup()

      const buttons = screen.queryAllByRole('button')

      await user.click(buttons[2])

      expect(props.setPage).toHaveBeenCalledTimes(1)
      expect(props.setPage).toHaveBeenCalledWith(2)
    })
  })

  describe('when clicking the previous page button', () => {
    test('calls setPage with the correct page number', async () => {
      const user = userEvent.setup()
      const { props } = setup({
        activePage: 2
      })

      const buttons = screen.queryAllByRole('button')

      await user.click(buttons[0])

      expect(props.setPage).toHaveBeenCalledTimes(1)
      expect(props.setPage).toHaveBeenCalledWith(1)
    })
  })

  describe.skip('when pagination component is passed count < limit', () => {
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
