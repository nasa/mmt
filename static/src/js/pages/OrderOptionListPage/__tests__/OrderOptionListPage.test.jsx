import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'

import OrderOptionList from '../../../components/OrderOptionList/OrderOptionList'
import OrderOptionListPage from '../OrderOptionListPage'

vi.mock('../../../components/OrderOptionList/OrderOptionList')
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(actual.useParams)
  }
})


const setup = () => {
  render(
    <BrowserRouter>
      <OrderOptionListPage />
    </BrowserRouter>
  )
}

describe('OrderOptionListPage', () => {
  describe('show order option page', () => {
    test('render the page and calls OrderOptionList', async () => {
      setup()

      expect(screen.getByRole('link', { name: 'Order Options' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Order Options' })).toBeInTheDocument()
      expect(OrderOptionList).toHaveBeenCalled(1)
    })
  })
})
