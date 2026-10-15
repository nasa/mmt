import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router'
import userEvent from '@testing-library/user-event'

import * as getConfig from 'sharedUtils/getConfig'

import CollectionSelectionContextProvider from '@/js/providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'
import Notifications from '@/js/components/Notifications/Notifications'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

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
  singlePageVariablesSearch,
  singlePageVisualizationsSearch
} from './__mocks__/searchResults'

import SearchList from '../SearchList'

const setup = (overrideMocks, overrideProps, overrideInitialEntries, bulkUpdateEnabled = true) => {
  vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
    bulkUpdateEnabled
  }))

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
        <NotificationsContextProvider>
          <CollectionSelectionContextProvider>
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
            <Notifications />
          </CollectionSelectionContextProvider>
        </NotificationsContextProvider>
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

        expect(
          within(within(table).getAllByRole('columnheader')[0]).getByRole('checkbox')
        ).toBeInTheDocument()

        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Short Name')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Version')
        expect(within(table).getAllByRole('columnheader')[3].textContent).toContain('Entry Title')
        expect(within(table).getAllByRole('columnheader')[4].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[5].textContent).toContain('Granule Count')
        expect(within(table).getAllByRole('columnheader')[6].textContent).toContain('Tags')
        expect(within(table).getAllByRole('columnheader')[7].textContent).toContain('Last Modified')
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

        expect(row1Cells).toHaveLength(8)
        expect(row1Cells[1].textContent).toBe('Collection Short Name 1')
        expect(row1Cells[2].textContent).toBe('1')
        expect(row1Cells[3].textContent).toBe('Collection Title 1')
        expect(row1Cells[4].textContent).toBe('TESTPROV')
        expect(row1Cells[5].textContent).toBe('1000')
        expect(row1Cells[6].textContent).toBe('1')
        expect(row1Cells[7].textContent).toBe('Thursday, November 30, 2023 12:00 AM')

        const row2 = tableRows[2]
        const row2Cells = within(row2).queryAllByRole('cell')

        expect(row2Cells).toHaveLength(8)
        expect(row2Cells[1].textContent).toBe('Collection Short Name 2')
        expect(row2Cells[2].textContent).toBe('2')
        expect(row2Cells[3].textContent).toBe('Collection Title 2')
        expect(row2Cells[4].textContent).toBe('MMT')
        expect(row2Cells[5].textContent).toBe('1234')
        expect(row2Cells[6].textContent).toBe('1')
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

        const button = within(row1Cells[6]).queryByRole('button', { name: '1' })

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

        const button = within(row1Cells[6]).queryByRole('button', { name: '1' })

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
      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage2], { limit: 3 }, ['/collections'])

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

        setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage2], { limit: 3 }, ['/collections'])

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const paginationContainers = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

        const paginationNavigation = paginationContainers[0]

        const paginationButton = within(paginationNavigation).getByRole('button', { name: 'Goto Page 2' })

        await user.click(paginationButton)

        await waitFor(() => {
          expect(screen.getAllByRole('cell')[1].textContent).toContain('Collection Short Name 4')
        })

        expect(within(paginationNavigation).getByLabelText('Current Page, Page 2')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking an ascending sort button', () => {
    test.skip('sorts and shows the the correctly classed sort buttons', async () => {
      const { user } = setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Asc], { limit: 3 }, ['/collections'])

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const dataRow1Before = await within(table).findAllByRole('row')

      expect(within(dataRow1Before[1]).getAllByRole('cell')[0].textContent).toContain('Collection Short Name 1')

      const shortNameHeader = within(table).getAllByRole('columnheader')[0]

      const ascendingButton = within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })

      await user.click(ascendingButton)

      const dataRow1After = await within(table).findAllByRole('row')

      await waitFor(() => {
        expect(within(dataRow1After[1]).getAllByRole('cell')[0].textContent).toContain('Collection Short Name 3')
      })

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
      } = setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1Desc], { limit: 3 }, ['/collections'])

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const shortNameHeader = within(table).getAllByRole('columnheader')[1]

      const descendingButton = within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })

      await user.click(descendingButton)

      const dataRow1 = await within(table).findAllByRole('row')

      expect(within(dataRow1[1]).getAllByRole('cell')[1].textContent).toContain('Collection Short Name 1')

      await waitFor(() => {
        expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in descending order/ })).not.toHaveClass('table__sort-button--inactive')
      })

      await waitFor(() => {
        expect(within(shortNameHeader).getByRole('button', { name: /Sort Short Name in ascending order/ })).toHaveClass('table__sort-button--inactive')
      })
    })
  })

  describe('when clicking the a custom sortFn sort button', () => {
    test('sorts and shows the button as active', async () => {
      const user = userEvent.setup()

      setup([multiPageCollectionSearchPage1, multiPageCollectionSearchPage1TitleAsc], { limit: 3 }, ['/collections'])

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(4)

      const entryTitleHeader = within(table).getAllByRole('columnheader')[3]

      const descendingButton = within(entryTitleHeader).getByRole('button', { name: /Sort Entry Title in ascending order/ })

      await user.click(descendingButton)

      await waitFor(() => {
        const dataRow1 = within(table).getAllByRole('row')
        expect(within(dataRow1[1]).getAllByRole('cell')[3].textContent).toContain('Collection Title 3')
      })

      await waitFor(() => {
        expect(within(entryTitleHeader).getByRole('button', { name: /Sort Entry Title in descending order/ })).toHaveClass('table__sort-button--inactive')
      })

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

  describe('when searching for visualizations', () => {
    beforeEach(() => {
      setup([singlePageVisualizationsSearch], {}, ['/visualizations'])
    })

    describe('while the request is loading', () => {
      test('renders the headers', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Provider')
        expect(within(table).getAllByRole('columnheader')[2].textContent).toContain('Last Modified')
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        const table = await screen.findByRole('table')

        const tableRows = within(table).getAllByRole('row')

        expect(tableRows.length).toEqual(3)

        const row1Cells = within(tableRows[1]).queryAllByRole('cell')

        expect(row1Cells).toHaveLength(3)
        expect(row1Cells[0].textContent).toBe('Visualization Name 1')
        expect(row1Cells[1].textContent).toBe('TESTPROV')
        expect(row1Cells[2].textContent).toBe('Monday, April 28, 2025 3:13 PM')
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

  describe('when selecting collection checkboxes', () => {
    test('toggles the checkbox selection state', async () => {
      const { user } = setup()

      const table = await screen.findByRole('table')
      const tableRows = within(table).getAllByRole('row')
      const row1Checkbox = within(tableRows[1]).getByRole('checkbox')

      expect(row1Checkbox).not.toBeChecked()

      await user.click(row1Checkbox)

      expect(row1Checkbox).toBeChecked()

      await user.click(row1Checkbox)

      expect(row1Checkbox).not.toBeChecked()
    })

    test('disables checkboxes from other providers once a collection is selected, with a tooltip explaining why', async () => {
      const { user } = setup()

      const table = await screen.findByRole('table')
      const tableRows = within(table).getAllByRole('row')

      // Collection 1 belongs to TESTPROV, Collection 2 belongs to MMT
      const row1Checkbox = within(tableRows[1]).getByRole('checkbox')
      const row2Checkbox = within(tableRows[2]).getByRole('checkbox')

      expect(row2Checkbox).not.toBeDisabled()

      await user.click(row1Checkbox)

      expect(row1Checkbox).toBeChecked()
      expect(row2Checkbox).toBeDisabled()
      expect(
        within(tableRows[2]).getByTitle(/Bulk actions can only include collections from a single provider/)
      ).toContainElement(row2Checkbox)
    })

    test('allows selecting a collection from a different provider after clearing the selection', async () => {
      const { user } = setup()

      const table = await screen.findByRole('table')
      const tableRows = within(table).getAllByRole('row')

      const row1Checkbox = within(tableRows[1]).getByRole('checkbox')
      const row2Checkbox = within(tableRows[2]).getByRole('checkbox')

      await user.click(row1Checkbox)
      await user.click(row1Checkbox)

      expect(row1Checkbox).not.toBeChecked()

      await user.click(row2Checkbox)

      expect(row2Checkbox).toBeChecked()
    })
  })

  describe('when selecting all collections on the page', () => {
    test('disables the header checkbox when nothing is selected and the page spans multiple providers, with a tooltip explaining why', async () => {
      const { user } = setup()

      const table = await screen.findByRole('table')
      const headerColumn = within(table).getAllByRole('columnheader')[0]
      const headerCheckbox = within(headerColumn).getByRole('checkbox')

      expect(headerCheckbox).toBeDisabled()
      expect(
        within(headerColumn).getByTitle('Filter by a provider to select all')
      ).toContainElement(headerCheckbox)

      await user.click(headerCheckbox)

      const tableRows = within(table).getAllByRole('row')

      expect(within(tableRows[1]).getByRole('checkbox')).not.toBeChecked()
      expect(within(tableRows[2]).getByRole('checkbox')).not.toBeChecked()
    })

    describe('when every row on the page shares the same provider', () => {
      test('selects all of them, and toggling the header checkbox again clears the page selection', async () => {
        const sameProviderMock = JSON.parse(JSON.stringify(singlePageCollectionSearch))
        sameProviderMock.result.data.collections.items[1].provider = 'TESTPROV'

        const { user } = setup([sameProviderMock])

        const table = await screen.findByRole('table')
        const headerCheckbox = within(
          within(table).getAllByRole('columnheader')[0]
        ).getByRole('checkbox')

        await user.click(headerCheckbox)

        const tableRows = within(table).getAllByRole('row')
        const row1Checkbox = within(tableRows[1]).getByRole('checkbox')
        const row2Checkbox = within(tableRows[2]).getByRole('checkbox')

        expect(row1Checkbox).toBeChecked()
        expect(row2Checkbox).toBeChecked()
        expect(headerCheckbox).toBeChecked()

        await user.click(headerCheckbox)

        expect(row1Checkbox).not.toBeChecked()
        expect(row2Checkbox).not.toBeChecked()
      })
    })

    describe('when a provider is already selected but no row on the page belongs to it', () => {
      test('disables the header checkbox instead of silently selecting nothing, with a tooltip explaining why', async () => {
        const user = userEvent.setup()

        vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
          bulkUpdateEnabled: true
        }))

        const noMatchingProviderMock = JSON.parse(JSON.stringify(singlePageCollectionSearch))
        noMatchingProviderMock.result.data.collections.items[0].provider = 'MMT'
        noMatchingProviderMock.result.data.collections.items[1].provider = 'MMT'

        const SeedSelection = () => {
          const { toggleCollectionSelection } = useCollectionSelectionContext()

          return (
            <button
              type="button"
              onClick={() => toggleCollectionSelection('C-SEED-TESTPROV', 'TESTPROV')}
            >
              Seed TESTPROV selection
            </button>
          )
        }

        render(
          <MemoryRouter initialEntries={['/collections?keyword=test']}>
            <MockedProvider mocks={[noMatchingProviderMock]}>
              <NotificationsContextProvider>
                <CollectionSelectionContextProvider>
                  <SeedSelection />
                  <Routes>
                    <Route
                      path="/:type"
                      element={
                        (
                          <Suspense fallback="Loading...">
                            <SearchList />
                          </Suspense>
                        )
                      }
                    />
                  </Routes>
                  <Notifications />
                </CollectionSelectionContextProvider>
              </NotificationsContextProvider>
            </MockedProvider>
          </MemoryRouter>
        )

        await user.click(screen.getByRole('button', { name: 'Seed TESTPROV selection' }))

        const table = await screen.findByRole('table')
        const headerColumn = within(table).getAllByRole('columnheader')[0]
        const headerCheckbox = within(headerColumn).getByRole('checkbox')

        expect(headerCheckbox).toBeDisabled()
        expect(
          within(headerColumn).getByTitle('No collections on this page belong to TESTPROV.')
        ).toContainElement(headerCheckbox)

        await user.click(headerCheckbox)

        const tableRows = within(table).getAllByRole('row')

        expect(within(tableRows[1]).getByRole('checkbox')).not.toBeChecked()
        expect(within(tableRows[2]).getByRole('checkbox')).not.toBeChecked()
      })
    })
  })

  describe('when bulk update is disabled', () => {
    test('does not render the selection checkbox column', async () => {
      setup(null, {}, undefined, false)

      const table = await screen.findByRole('table')

      expect(within(table).queryAllByRole('checkbox')).toHaveLength(0)
    })
  })

  describe('when an invalid type is passed', () => {
    test('renders the 404 page', async () => {
      setup(null, {}, ['/asdf?keyword='])

      expect(await screen.findByText('404 page')).toBeInTheDocument()
    })
  })

  describe('when query for collections', () => {
    test('query should include non-operational collections', () => {
      const { request } = singlePageCollectionSearch

      expect(request.variables.params.includeNonOperational).toBe(true)
    })
  })
})
