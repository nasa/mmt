import React from 'react'
import {
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import {
  multiPageCollectionSearchPage1,
  multiPageCollectionSearchPage1Asc,
  multiPageCollectionSearchPage1Desc,
  multiPageCollectionSearchPage1TitleAsc,
  multiPageCollectionSearchPage2,
  singlePageCollectionSearch,
  singlePageCollectionSearchError
} from './__mocks__/searchResults'

import SearchPage from '../SearchPage'
import AppContext from '../../../context/AppContext'

const setup = (overrideMocks, overrideProps, overrideInitialEntries) => {
  const mocks = [
    singlePageCollectionSearch
  ]

  let props = {}

  if (overrideProps) {
    props = {
      ...props,
      ...overrideProps
    }
  }

  const { container } = render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        }
      }
    }
    >
      <MemoryRouter initialEntries={overrideInitialEntries || ['/search?type=collections&keyword=']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/search"
              element={<SearchPage {...props} />}
            />
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    </AppContext.Provider>
  )

  return {
    container
  }
}

describe('SearchPage component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
    })

    describe('while the request is loading', () => {
      test('renders the placeholders', async () => {
        expect(screen.queryAllByRole('cell', {
          busy: true,
          hidden: true
        })).toHaveLength(140)
      })

      test('renders the headers', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })

        const rows = screen.queryAllByRole('row')

        const headerRow = rows[0]

        expect(headerRow.children[0].textContent).toContain('Short Name')
        expect(headerRow.children[1].textContent).toContain('Version')
        expect(headerRow.children[2].textContent).toContain('Entry Title')
        expect(headerRow.children[3].textContent).toContain('Provider')
        expect(headerRow.children[4].textContent).toContain('Granule Count')
        expect(headerRow.children[5].textContent).toContain('Tags')
        expect(headerRow.children[6].textContent).toContain('Last Modified')
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })

        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row2 = rows[2]
        const row1Cells = within(row1).queryAllByRole('cell')
        const row2Cells = within(row2).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(7)
        expect(row1Cells[0].textContent).toBe('Collection Short Name 1')
        expect(row1Cells[1].textContent).toBe('1')
        expect(row1Cells[2].textContent).toBe('Collection Title 1')
        expect(row1Cells[3].textContent).toBe('TESTPROV')
        expect(row1Cells[4].textContent).toBe('1000')
        expect(row1Cells[5].textContent).toBe('1')
        expect(row1Cells[6].textContent).toBe('2023-11-30 00:00:00')

        expect(row2Cells).toHaveLength(7)
        expect(row2Cells[0].textContent).toBe('Collection Short Name 2')
        expect(row2Cells[1].textContent).toBe('2')
        expect(row2Cells[2].textContent).toBe('Collection Title 2')
        expect(row2Cells[3].textContent).toBe('MMT')
        expect(row2Cells[4].textContent).toBe('1234')
        expect(row2Cells[5].textContent).toBe('2')
        expect(row2Cells[6].textContent).toBe('2023-11-31 00:00:00')
      })
    })

    describe('when clicking the tag button', () => {
      test('displays the modal', async () => {
        const user = userEvent.setup()

        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })

        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row1Cells = within(row1).queryAllByRole('cell')

        const button = within(row1Cells[5]).queryByRole('button', { name: '1' })

        await user.click(button)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).queryByText('1 tag')).toBeInTheDocument()
        expect(within(modal).queryByText('Tag Key:')).toBeInTheDocument()
        expect(within(modal).queryByText('test.tag.one')).toBeInTheDocument()
        expect(within(modal).queryByText('Data:')).toBeInTheDocument()
        expect(within(modal).queryByText('Tag Data 1')).toBeInTheDocument()
      })
    })

    describe('when clicking the close modal button', () => {
      test('closes the modal', async () => {
        const user = userEvent.setup()

        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })

        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row1Cells = within(row1).queryAllByRole('cell')

        const button = within(row1Cells[5]).queryByRole('button', { name: '1' })

        await user.click(button)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()

        const closeButton = within(modal).queryByRole('button', { name: 'Close' })

        await user.click(closeButton)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('with multiple pages of results', () => {
    test('shows the pagination', async () => {
      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage2], { limit: 3 })

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
      })

      const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      expect(within(pagination[0]).getAllByRole('button')).toHaveLength(3)

      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')
      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 3' })).toHaveTextContent('3')
      expect(within(pagination[0]).getByRole('button', { name: 'Goto Next Page' })).toHaveTextContent('›Next')

      expect(within(pagination[1]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')
      expect(within(pagination[1]).getByRole('button', { name: 'Goto Page 3' })).toHaveTextContent('3')
      expect(within(pagination[1]).getByRole('button', { name: 'Goto Next Page' })).toHaveTextContent('›Next')
    })

    describe('when clicking a pagination item', () => {
      test('shows the pagination', async () => {
        const user = userEvent.setup()

        setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage2], { limit: 3 })

        await waitFor(() => {
          expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
        })

        const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })[0]
        const paginationButton = within(pagination).getByRole('button', { name: 'Goto Page 2' })

        await user.click(paginationButton)

        await waitFor(() => {
          expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 4')
        })

        expect(within(pagination).queryByLabelText('Current Page, Page 2')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking an ascending sort button', () => {
    test('sorts and shows the button as active', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Asc], { limit: 3 })

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
      })

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const ascendingButton = within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })

      user.click(ascendingButton)

      await waitFor(() => {
        const dataRow1 = screen.queryAllByRole('row')[1]
        expect(within(dataRow1).queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')
      })

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })).not.toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when clicking an descending sort button', () => {
    test('sorts and shows the button as active', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Desc], { limit: 3 })

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
      })

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const descendingButton = within(row1).queryByRole('button', { name: /Sort Short Name in descending order/ })

      user.click(descendingButton)

      await waitFor(() => {
        const dataRow1 = screen.queryAllByRole('row')[1]
        expect(within(dataRow1).queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')
      })

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in descending order/ })).not.toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when clicking an active sort button', () => {
    test('sorts and shows the button as inactive', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1Asc, multiPageCollectionSearchPage1], { limit: 3 }, ['/search?type=collections&keyword=&sortKey=-shortName'])

      await waitFor(() => {
        const dataRow1 = screen.queryAllByRole('row')[1]
        expect(within(dataRow1).queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')
      })

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const ascendingButton = within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })

      // Screen.debug(ascendingButton)
      user.click(ascendingButton)

      await waitFor(() => {
        const dataRow1 = screen.queryAllByRole('row')[1]
        expect(within(dataRow1).queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
      })

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when clicking the a custom sortFn sort button', () => {
    test('sorts and shows the button as active', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1TitleAsc], { limit: 3 })

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')
      })

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const ascendingButton = within(row1).queryByRole('button', { name: /Sort Entry Title in ascending order/ })

      user.click(ascendingButton)

      await waitFor(() => {
        const dataRow1 = screen.queryAllByRole('row')[1]
        expect(within(dataRow1).queryAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')
      })

      expect(within(row1).queryByRole('button', { name: /Sort Entry Title in ascending order/ })).not.toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when encountering an error', () => {
    test('sorts and shows the button as active', async () => {
      setup([singlePageCollectionSearchError])

      await waitFor(() => {
        expect(screen.queryByText('Sorry!')).toBeInTheDocument()
        expect(screen.queryByText('An error occurred')).toBeInTheDocument()
      })
    })
  })
})
