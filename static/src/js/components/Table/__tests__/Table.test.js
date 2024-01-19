import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table from '../Table'

const setup = (overrideProps = {}) => {
  const props = {
    headers: [
      'column 1',
      'column 2'
    ],
    loading: false,
    renderRows: [
      [
        <span key="BEAM-001/col2">
          Row 1 Cell 1
        </span>,
        <span key="BEAM-001/col2">
          Row 1 Cell 2
        </span>
      ],
      [
        <span key="BEAM-001/col2">
          Row 2 Cell 1
        </span>,
        <span key="BEAM-001/col2">
          Row 2 Cell 2
        </span>
      ]
    ],
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
  describe('when the table component is passed markup and data', () => {
    test('renders filled table', () => {
      setup()

      expect(screen.getByText('column 1')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Row 2 Cell 2')).toBeInTheDocument()
    })
  })

  describe('when the table component is passed a custom error mesage with no data', () => {
    test('renders custom error message', () => {
      setup({
        renderRows: [],
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

      const buttons = screen.queryAllByRole('button', { className: 'btn-sm col-10 placeholder placeholder-sm btn btn-secondary' })
      expect(screen.getByRole('table', { className: 'table table-striped' })).toBeInTheDocument()
      expect(buttons).toHaveLength(5)
    })
  })
})
