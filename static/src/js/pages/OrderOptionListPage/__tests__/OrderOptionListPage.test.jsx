import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import OrderOptionList from '../../../components/OrderOptionList/OrderOptionList'
import OrderOptionListPage from '../OrderOptionListPage'

vi.mock('../../../components/OrderOptionList/OrderOptionList')

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
