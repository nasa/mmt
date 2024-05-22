import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import PermissionList from '@/js/components/PermissionList/PermissionList'
import AppContext from '../../../context/AppContext'
import PermissionListPage from '../PermissionListPage'

vi.mock('../../../components/PermissionList/PermissionList')

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
        <PermissionListPage />
      </BrowserRouter>
    </AppContext.Provider>
  )
}

describe('PermissionListPage', () => {
  describe('show permission list page', () => {
    test('render the page and calls PermissionList', async () => {
      setup()

      expect(screen.getAllByText('Collection Permissions')[0]).toBeInTheDocument()
      expect(PermissionList).toHaveBeenCalled(1)
    })
  })
})
