import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingTable from '../LoadingTable'

const setup = () => {
  render(
    <LoadingTable />
  )
}

describe('LoadingTable', () => {
  test('should render table', async () => {
    setup()
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })
})
