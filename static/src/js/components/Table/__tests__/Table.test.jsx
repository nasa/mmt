import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table from '../Table'

vi.mock('../../DraftList/DraftList')

const setup = (overrideProps = {}) => {
  const props = {
    columns: [
      {
        dataKey: 'title',
        title: 'Column 1'
      },
      {
        dataKey: 'content',
        title: 'Column 2'
      }
    ],
    data: [
      {
        title: 'Title 1',
        content: 'Content 1'
      },
      {
        title: 'Title 2',
        content: 'Content 2'
      },
      {
        title: 'Title 3',
        content: 'Content 3'
      }
    ],
    generateRowKey: ({ title }) => title,
    generateCellKey: ({ title }, key) => title + key,
    id: 'test-table',
    loading: false,
    limit: 10,
    noDataMessage: 'No data available',
    ...overrideProps
  }

  const { container } = render(
    <Table {...props} />
  )

  return {
    container,
    props,
    user: userEvent.setup()
  }
}

describe('Table', () => {
  describe('when the table component is passed markup and data that is more than the defaultPageSize', () => {
    test('renders filled table without correct number of rows', () => {
      setup()

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Column 1')).toBeInTheDocument()
      expect(screen.getByText('Column 2')).toBeInTheDocument()
      expect(screen.getByText('Title 1')).toBeInTheDocument()
      expect(screen.getByText('Title 2')).toBeInTheDocument()
      expect(screen.getByText('Title 3')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
      expect(screen.getByText('Content 3')).toBeInTheDocument()
    })
  })

  describe('when there is no data passed', () => {
    test('renders the empty message', () => {
      setup({
        data: []
      })

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })
  })

  describe('when the data is loading', () => {
    test('renders the loading state', () => {
      const { container } = setup({
        loading: true
      })

      const skeletons = container.getElementsByClassName('placeholder')

      expect(skeletons).toHaveLength(20)
    })
  })

  describe('when accessing data with a function', () => {
    test('renders the correct data', () => {
      setup({
        columns: [
          {
            dataKey: 'title',
            title: 'Column 1'
          },
          {
            dataKey: 'content',
            title: 'Column 2',
            dataAccessorFn: (cellData) => cellData.toLowerCase()
          }
        ],
        data: [
          {
            title: 'Title 1',
            content: 'Content 1'
          },
          {
            title: 'Title 2',
            content: 'Content 2'
          },
          {
            title: 'Title 3',
            content: 'Content 3'
          }
        ]
      })

      expect(screen.getByText('content 1')).toBeInTheDocument()
      expect(screen.getByText('content 2')).toBeInTheDocument()
      expect(screen.getByText('content 3')).toBeInTheDocument()
    })
  })

  describe('when a sort is defined', () => {
    test('renders the sort buttons on the column header', () => {
      const sortFn = vi.fn()
      setup({
        sortKey: 'title',
        columns: [
          {
            dataKey: 'title',
            title: 'Column 1',
            sortFn
          },
          {
            dataKey: 'content',
            title: 'Column 2'
          }
        ]
      })

      expect(screen.getByRole('button', { name: /Sort Column 1 in ascending order/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sort Column 1 in descending order/ })).toBeInTheDocument()
    })

    describe('when a sort key override is defined', () => {
      test('calls the sort function with the override value', async () => {
        const user = userEvent.setup()
        const sortFn = vi.fn()
        setup({
          sortKey: 'name',
          columns: [
            {
              dataKey: 'title',
              title: 'Column 1',
              sortKey: 'name',
              sortFn
            },
            {
              dataKey: 'content',
              title: 'Column 2'
            }
          ]
        })

        const button = screen.getByRole('button', { name: /Sort Column 1 in ascending order/ })

        await user.click(button)

        expect(sortFn).toHaveBeenCalledTimes(1)
        expect(sortFn).toHaveBeenCalledWith('name', 'ascending')
      })
    })

    describe('when clicking the ascending sort button', () => {
      describe('when no sort is applied', () => {
        test('applies the ascending sort', async () => {
          const user = userEvent.setup()
          const sortFn = vi.fn()
          setup({
            columns: [
              {
                dataKey: 'title',
                title: 'Column 1',
                sortFn
              },
              {
                dataKey: 'content',
                title: 'Column 2'
              }
            ]
          })

          const button = screen.getByRole('button', { name: /Sort Column 1 in ascending order/ })

          await user.click(button)

          expect(sortFn).toHaveBeenCalledTimes(1)
          expect(sortFn).toHaveBeenCalledWith('title', 'ascending')
        })
      })

      describe('when ascending is applied', () => {
        test('removes the sort', async () => {
          const user = userEvent.setup()
          const sortFn = vi.fn()
          setup({
            sortKey: '-title',
            columns: [
              {
                dataKey: 'title',
                title: 'Column 1',
                sortFn
              },
              {
                dataKey: 'content',
                title: 'Column 2'
              }
            ]
          })

          const button = screen.getByRole('button', { name: /Sort Column 1 in ascending order/ })

          await user.click(button)

          expect(sortFn).toHaveBeenCalledTimes(1)
          expect(sortFn).toHaveBeenCalledWith('title')
        })
      })
    })

    describe('when clicking the descending sort button', () => {
      describe('when no sort is applied', () => {
        test('applies the descending sort', async () => {
          const user = userEvent.setup()
          const sortFn = vi.fn()
          setup({
            columns: [
              {
                dataKey: 'title',
                title: 'Column 1',
                sortFn
              },
              {
                dataKey: 'content',
                title: 'Column 2'
              }
            ]
          })

          const button = screen.getByRole('button', { name: /Sort Column 1 in descending order/ })

          await user.click(button)

          expect(sortFn).toHaveBeenCalledTimes(1)
          expect(sortFn).toHaveBeenCalledWith('title', 'descending')
        })
      })

      describe('when descending is applied', () => {
        test('removes the sort', async () => {
          const user = userEvent.setup()
          const sortFn = vi.fn()
          setup({
            sortKey: 'title',
            columns: [
              {
                dataKey: 'title',
                title: 'Column 1',
                sortFn
              },
              {
                dataKey: 'content',
                title: 'Column 2'
              }
            ]
          })

          const button = screen.getByRole('button', { name: /Sort Column 1 in descending order/ })

          await user.click(button)

          expect(sortFn).toHaveBeenCalledTimes(1)
          expect(sortFn).toHaveBeenCalledWith('title')
        })
      })
    })
  })
})
