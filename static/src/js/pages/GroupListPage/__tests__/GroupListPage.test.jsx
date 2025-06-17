import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import usePermissions from '@/js/hooks/usePermissions'

import GroupList from '../../../components/GroupList/GroupList'
import GroupSearchForm from '../../../components/GroupSearchForm/GroupSearchForm'
import GroupListPage from '../GroupListPage'

vi.mock('@/js/hooks/usePermissions')

vi.mock('@/js/components/GroupList/GroupList', () => ({ default: vi.fn(() => null) }))

vi.mock('@/js/components/GroupSearchForm/GroupSearchForm', () => ({ default: vi.fn(() => null) }))

const setup = (
  pageUrl = '/groups',
  hasSystemGroup = true
) => {
  usePermissions.mockReturnValue({ hasSystemGroup })

  render(
    <MemoryRouter initialEntries={[pageUrl]}>
      <Routes>
        <Route
          path="/groups"
          element={(
            <GroupListPage />
          )}
        />
        <Route
          path="/admin/groups"
          element={(
            <GroupListPage isAdminPage />
          )}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('GroupListPage', () => {
  describe('when the page is provider groups', () => {
    test('render the page and calls GroupList', async () => {
      setup()

      expect(screen.getByRole('heading', { value: 'Groups' })).toBeInTheDocument()

      expect(GroupList).toHaveBeenCalledTimes(1)
      expect(GroupList).toHaveBeenCalledWith({ isAdminPage: false }, {})

      expect(GroupSearchForm).toHaveBeenCalledTimes(1)
      expect(GroupSearchForm).toHaveBeenCalledWith({ isAdminPage: false }, {})
    })
  })

  describe('when the page is system groups', () => {
    test('render the page and calls GroupList', async () => {
      setup('/admin/groups')

      expect(screen.getByRole('heading', { value: 'System Groups' })).toBeInTheDocument()

      expect(GroupList).toHaveBeenCalledTimes(1)
      expect(GroupList).toHaveBeenCalledWith({ isAdminPage: true }, {})

      expect(GroupSearchForm).toHaveBeenCalledTimes(1)
      expect(GroupSearchForm).toHaveBeenCalledWith({ isAdminPage: true }, {})
    })

    describe('when the user does not have system group create permission', () => {
      test('does not render the New System Group button', async () => {
        setup('/admin/groups', false)

        expect(screen.getByRole('heading', { value: 'System Groups' })).toBeInTheDocument()

        expect(screen.queryByRole('button', { value: 'New System Group' })).not.toBeInTheDocument()
      })
    })
  })
})
