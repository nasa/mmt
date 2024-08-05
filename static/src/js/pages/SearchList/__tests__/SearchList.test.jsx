import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
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
  singlePageServicesSearch,
  singlePageToolsSearch,
  singlePageToolsSearchWithProvider,
  singlePageVariablesSearch
} from './__mocks__/searchResults'

import SearchList from '../SearchList'

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

  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={overrideInitialEntries || ['/collections?keyword=test']}>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <Routes>
          <Route
            path="/:type"
            element={
              (
                <Suspense fallback="Loading...">
                  <SearchList {...props} />
                </Suspense>
              )
            }
          />
          <Route
            path="/404"
            element={<div>404 page</div>}
          />
        </Routes>
      </MockedProvider>
    </MemoryRouter>
  )

  return {
    user
  }
}

describe('SearchPage component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
    })

    describe('while the request is loading', () => {
      test('renders the placeholders', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        expect(within(table).getAllByRole('columnheader')[0].textContent).toContain('Short Name')
        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Version')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Entry Title')
        expect(within(table).getAllByRole('columnheader')[3].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[4].textContent).toContain('Granule Count')
        expect(within(table).getAllByRole('columnheader')[5].textContent).toContain('Tags')
        expect(within(table).getAllByRole('columnheader')[6].textContent).toContain('Last Modified')
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        const row1 = tableRows[1]
        const row1Cells = within(row1).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(7)
        expect(row1Cells[0].textContent).toBe('Collection Short Name 1')
        expect(row1Cells[1].textContent).toBe('1')
        expect(row1Cells[2].textContent).toBe('Collection Title 1')
        expect(row1Cells[3].textContent).toBe('TESTPROV')
        expect(row1Cells[4].textContent).toBe('1000')
        expect(row1Cells[5].textContent).toBe('1')
        expect(row1Cells[6].textContent).toBe('Thursday, November 30, 2023 12:00 AM')

        const row2 = tableRows[2]
        const row2Cells = within(row2).queryAllByRole('cell')

        expect(row2Cells).toHaveLength(7)
        expect(row2Cells[0].textContent).toBe('Collection Short Name 2')
        expect(row2Cells[1].textContent).toBe('2')
        expect(row2Cells[2].textContent).toBe('Collection Title 2')
        expect(row2Cells[3].textContent).toBe('MMT')
        expect(row2Cells[4].textContent).toBe('1234')
        expect(row2Cells[5].textContent).toBe('1')
      })
    })

    describe('when clicking the tag button', () => {
      test('displays the modal', async () => {
        const user = userEvent.setup()

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

        const button = within(row1Cells[5]).queryByRole('button', { name: '1' })

        await user.click(button)

        const modal = screen.queryByRole('dialog')

        expect(modal).toBeInTheDocument()
        expect(within(modal).getByText('1 tag')).toBeInTheDocument()
        expect(within(modal).getByText('Tag Key:')).toBeInTheDocument()
        expect(within(modal).getByText('test.tag.one')).toBeInTheDocument()
        expect(within(modal).getByText('Description:')).toBeInTheDocument()
        expect(within(modal).getByText('Mock tag description')).toBeInTheDocument()
      })
    })

    describe('when clicking the close modal button', () => {
      test('closes the modal', async () => {
        const user = userEvent.setup()

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

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

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const pagination = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

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
      test('navigates correctly and shows the correct pagination links', async () => {
        const user = userEvent.setup()

        setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage2], { limit: 3 })

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const paginationContainers = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

        const paginationNavigation = paginationContainers[0]

        const paginationButton = within(paginationNavigation).getByRole('button', { name: 'Goto Page 2' })

        await user.click(paginationButton)

        const paginationCells = await screen.findAllByRole('cell')

        expect(paginationCells[0].textContent).toContain('Collection Short Name 4')

        expect(within(paginationNavigation).getByLabelText('Current Page, Page 2')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking an ascending sort button', () => {
    test('sorts and shows the the correctly classed sort buttons', async () => {
      const {
        user
      } = setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Asc], { limit: 3 })

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const shortNameHeader = within(table).getAllByRole('columnheader')[0]

      const ascendingButton = within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })

      await user.click(ascendingButton)

      const dataRow1 = await within(table).findAllByRole('row')

      expect(within(dataRow1[1]).getAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')

      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('table__sort-button--inactive')
      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })).not.toHaveClass('table__sort-button--inactive')

      // Checks to see that table goes back to original order
      await user.click(ascendingButton)

      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('table__sort-button--inactive')
      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when clicking an descending sort button', () => {
    test('sorts and shows the correctly classed the sort buttons', async () => {
      const {
        user
      } = setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Desc], { limit: 3 })

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const shortNameHeader = within(table).getAllByRole('columnheader')[0]

      const descendingButton = within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })

      await user.click(descendingButton)

      const dataRow1 = await within(table).findAllByRole('row')

      expect(within(dataRow1[1]).getAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')

      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })).not.toHaveClass('table__sort-button--inactive')
      expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when clicking the a custom sortFn sort button', () => {
    test('sorts and shows the button as active', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1TitleAsc], { limit: 3 })

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const entryTitleHeader = within(table).getAllByRole('columnheader')[2]

      const descendingButton = within(entryTitleHeader).getByRole('button', { name: /Sort Entry Title in ascending order/ })

      await user.click(descendingButton)

      const dataRow1 = await within(table).findAllByRole('row')

      expect(within(dataRow1[1]).getAllByRole('cell')[2].textContent).toContain('Collection Title 3')

      expect(within(entryTitleHeader).getByRole('button', { name: /Sort Entry Title in descending order/ })).toHaveClass('table__sort-button--inactive')
      expect(within(entryTitleHeader).getByRole('button', { name: /Sort Entry Title in ascending order/ })).not.toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when searching for services', () => {
    beforeEach(() => {
      setup([singlePageServicesSearch], {}, ['/services?&keyword='])
    })

    describe('when the request has loaded', () => {
      test('renders the headers', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(2)

        expect(within(table).getAllByRole('columnheader')[0].textContent).toContain('Name')
        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Long Name')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[3].textContent).toContain('Last Modified')
      })

      test('renders the data', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(2)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('Service Name 1')
        expect(row1Cells[1].textContent).toBe('Service Long Name 1')
        expect(row1Cells[2].textContent).toBe('TESTPROV')
        expect(row1Cells[3].textContent).toBe('Thursday, November 30, 2023 12:00 AM')
      })
    })
  })

  describe('when searching for tools', () => {
    beforeEach(() => {
      setup([singlePageToolsSearch], {}, ['/tools?keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the headers', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        expect(within(table).getAllByRole('columnheader')[0].textContent).toContain('Name')
        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Long Name')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[3].textContent).toContain('Last Modified')
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('Tool Name 2')
        expect(row1Cells[1].textContent).toBe('Tool Long Name 2')
        expect(row1Cells[2].textContent).toBe('MMT_1')
        expect(row1Cells[3].textContent).toBe('Thursday, November 30, 2023 12:00 AM')
      })
    })
  })

  describe('when searching for variables', () => {
    beforeEach(() => {
      setup([singlePageVariablesSearch], {}, ['/variables?keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the headers', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(2)

        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Long Name')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[3].textContent).toContain('Last Modified')
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(2)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('Variable Name 1')
        expect(row1Cells[1].textContent).toBe('Variable Long Name 1')
        expect(row1Cells[2].textContent).toBe('TESTPROV')
        expect(row1Cells[3].textContent).toBe('Thursday, November 30, 2023 12:00 AM')
      })
    })
  })

  describe('when a provider is defined', () => {
    beforeEach(() => {
      setup([singlePageToolsSearchWithProvider], {}, ['/tools?provider=TESTPROV'])
    })

    describe('when the request resolves', () => {
      test('renders the results', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(2)

        const row1 = tableRows[1]
        const row1Cells = within(row1).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(4)

        expect(row1Cells[0].textContent).toContain('Tool Name 1')
        expect(row1Cells[1].textContent).toContain('Long Name')
        expect(row1Cells[2].textContent).toContain('TESTPROV')
        expect(row1Cells[3].textContent).toContain('Thursday, November 30, 2023 12:00 AM')
      })
    })

    test('renders the search query', async () => {
      expect(await screen.findByText('1 tool for: Provider “TESTPROV”')).toBeInTheDocument()
    })
  })

  describe('when an invalid type is passed', () => {
    test('renders the 404 page', async () => {
      setup(null, {}, ['/asdf?keyword='])

      expect(await screen.findByText('404 page')).toBeInTheDocument()
    })
  })
})
