import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes
} from 'react-router'

import usePermissions from '@/js/hooks/usePermissions'

import CheckPermissions from '../CheckPermissions'

vi.mock('@/js/hooks/usePermissions')
vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

const setup = (hasSystemGroup = true) => {
  usePermissions.mockReturnValue({ hasSystemGroup })

  render(
    <MemoryRouter initialEntries={['/mock-path']}>
      <Routes>
        <Route path="/mock-path" element={<CheckPermissions systemGroup={['read']} />}>
          <Route
            index
            element={
              (
                <>
                  This is some content
                </>
              )
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('CheckPermissions', () => {
  describe('systemGroup permissions', () => {
    describe('when the user has the given permission', () => {
      test('renders the children', () => {
        setup()

        expect(screen.getByText('This is some content')).toBeInTheDocument()
      })
    })

    describe('when the user does not have the given permission', () => {
      test('redirects the user to /', () => {
        setup(false)

        expect(screen.queryByText('This is some content')).not.toBeInTheDocument()

        expect(Navigate).toHaveBeenCalledTimes(1)
        expect(Navigate).toHaveBeenCalledWith({
          to: '/'
        }, {})
      })
    })
  })
})
