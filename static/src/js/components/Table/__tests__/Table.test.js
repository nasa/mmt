import React from 'react'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table from '../Table'

jest.mock('../../../../../../static.config.json', () => ({
  application: { defaultPageSize: 2 }
}))

const setup = (overrideProps = {}) => {
  const props = {
    headers: [
      'column 1',
      'column 2'
    ],
    loading: false,
    data: [
      {
        key: 'conceptId001',
        cells: [
          {
            value: ('Row 1 Cell 1')
          },
          {
            value: ('Row 1 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId002',
        cells: [
          {
            value: ('Row 2 Cell 1')
          },
          {
            value: ('Row 2 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId003',
        cells: [
          {
            value: ('Row 3 Cell 1')
          },
          {
            value: ('Row 3 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId004',
        cells: [
          {
            value: ('Row 4 Cell 1')
          },
          {
            value: ('Row 4 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId005',
        cells: [
          {
            value: ('Row 5 Cell 1')
          },
          {
            value: ('Row 5 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId006',
        cells: [
          {
            value: ('Row 6 Cell 1')
          },
          {
            value: ('Row 6 Cell 2')
          }
        ]
      },
      {
        key: 'conceptId007',
        cells: [
          {
            value: ('Row 7 Cell 1')
          },
          {
            value: ('Row 7 Cell 2')
          }
        ]
      }
    ],
    count: 7,
    ...overrideProps
  }

  render(
    <Table {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Table', () => {
  describe('when the table component is passed markup and data that is more than the defaultPageSize', () => {
    test('renders filled table with Pagination', () => {
      setup()

      // Checking all pages exist upon loading. Previous and 1 are not clickable buttons.
      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('column 1')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Row 2 Cell 2')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Next' })).toBeInTheDocument()
      expect(screen.getByText('More')).toBeInTheDocument()
      expect(screen.getByText('Showing 0-2 of 7 Results')).toBeInTheDocument()

      // Check the next button works
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.queryByRole('button', { name: 'Previous' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('column 1')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Row 3 Cell 1')).toBeInTheDocument()
      expect(screen.getByText('Showing 2-4 of 7 Results')).toBeInTheDocument()

      // Check individual buttons work
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      expect(screen.queryByRole('button', { name: '2' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Showing 4-6 of 7 Results')).toBeInTheDocument()

      // Check Previous Button Works
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
      expect(screen.queryByRole('button', { name: 'Previous' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '1' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Showing 2-4 of 7 Results')).toBeInTheDocument()
    })
  })

  describe('when the table compoent is passed markup and data that is less than the defaultPageSize', () => {
    test('renders filled table without Pagination', () => {
      setup({
        data: [
          {
            key: 'conceptId001',
            cells: [
              {
                value: ('Row 1 Cell 1')
              },
              {
                value: ('Row 1 Cell 2')
              }
            ]
          }
        ]
      })

      expect(screen.getByText('column 1')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Row 1 Cell 2')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('when the table component is passed a custom error mesage with no data', () => {
    test('renders custom error message', () => {
      setup({
        data: [],
        error: 'Custom Error Message'
      })

      expect(screen.getByText('Custom Error Message')).toBeInTheDocument()
    })
  })

  describe('when the table component is passed loading:true', () => {
    test('renders loading screen', () => {
      setup({
        loading: true
      })

      expect(screen.getByRole('table', { className: 'table table-striped' })).toBeInTheDocument()
      expect(screen.queryAllByRole('cell', { className: 'col-md-4' })).toHaveLength(4)
    })
  })
})
