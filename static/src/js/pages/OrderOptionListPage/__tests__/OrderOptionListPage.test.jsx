import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import AppContext from '../../../context/AppContext'

import OrderOptionList from '../../../components/OrderOptionList/OrderOptionList'
import OrderOptionListPage from '../OrderOptionListPage'

vi.mock('../../../components/OrderOptionList/OrderOptionList')

const setup = () => {
  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <BrowserRouter>
        <OrderOptionListPage />
      </BrowserRouter>
    </AppContext.Provider>
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
