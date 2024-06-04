import React from 'react'
import { render, screen } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import PermissionList from '@/js/components/PermissionList/PermissionList'
import PermissionListPage from '../PermissionListPage'

vi.mock('../../../components/PermissionList/PermissionList')

const setup = () => {
  render(
    <BrowserRouter>
      <PermissionListPage />
    </BrowserRouter>
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
