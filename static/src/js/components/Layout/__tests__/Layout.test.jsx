import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'

import usePermissions from '@/js/hooks/usePermissions'

import AuthContext from '@/js/context/AuthContext'
import userEvent from '@testing-library/user-event'
import Layout from '../Layout'
import PrimaryNavigation from '../../PrimaryNavigation/PrimaryNavigation'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

vi.mock('@/js/hooks/usePermissions')
vi.mock('../../Footer/Footer')
vi.mock('../../Header/Header')
vi.mock('../../PrimaryNavigation/PrimaryNavigation')

const setup = (loggedIn) => {
  vi.spyOn(getConfig, 'getUmmVersionsConfig').mockImplementation(() => ({
    ummC: 'mock-umm-c',
    ummS: 'mock-umm-s',
    ummT: 'mock-umm-t',
    ummV: 'mock-umm-v'
  }))

  vi.setSystemTime('2024-01-01')

  const now = new Date().getTime()

  const tokenExpires = loggedIn ? now + 1 : now - 1

  const context = {
    user: {
      name: 'User Name'
    },
    login: vi.fn(),
    tokenExpires
  }

  const user = userEvent.setup()

  render(
    <AuthContext.Provider value={context}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
      </BrowserRouter>
    </AuthContext.Provider>
  )

  return {
    user
  }
}

describe('Layout component', () => {
  test('renders the content to the React Router Outlet', async () => {
    usePermissions.mockReturnValue({ hasSystemGroup: true })

    setup()

    expect(screen.getByText('This is some content')).toBeInTheDocument()

    expect(usePermissions).toHaveBeenCalledTimes(1)
    expect(usePermissions).toHaveBeenCalledWith({
      systemGroup: ['read']
    })

    expect(PrimaryNavigation).toHaveBeenCalledTimes(1)
    expect(PrimaryNavigation).toHaveBeenCalledWith({
      items: [
        [
          {
            title: 'Collections',
            version: 'vmock-umm-c',
            children: [
              {
                title: 'All Collections',
                to: '/collections'
              },
              {
                to: '/drafts/collections',
                title: 'Drafts'
              },
              {
                to: '/templates/collections',
                title: 'Templates'
              },
              {
                title: 'Permissions',
                to: '/permissions'
              }
            ]
          },
          {
            title: 'Variables',
            version: 'vmock-umm-v',
            children: [
              {
                title: 'All Variables',
                to: '/variables'
              },
              {
                to: '/drafts/variables',
                title: 'Drafts'
              }
            ]
          },
          {
            title: 'Services',
            version: 'vmock-umm-s',
            children: [
              {
                title: 'All Services',
                to: '/services'
              },
              {
                to: '/drafts/services',
                title: 'Drafts'
              }
            ]
          },
          {
            title: 'Tools',
            version: 'vmock-umm-t',
            children: [
              {
                title: 'All Tools',
                to: '/tools'
              },
              {
                to: '/drafts/tools',
                title: 'Drafts'
              }
            ]
          },
          {
            title: 'Order Options',
            children: [
              {
                title: 'All Order Options',
                to: '/order-options'
              }
            ]
          },
          {
            title: 'Groups',
            children: [
              {
                title: 'All Groups',
                to: '/groups'
              }
            ]
          }
        ],
        [
          {
            title: 'Admin',
            visible: true,
            children: [
              {
                to: '/admin/groups',
                title: 'System Groups',
                visible: true
              }
            ]
          }
        ]
      ]
    }, {})
  })

  describe('when the user does not have system group permissions', () => {
    test('does not render the admin links', async () => {
      usePermissions.mockReturnValue({ hasSystemGroup: false })

      setup()

      expect(screen.getByText('This is some content')).toBeInTheDocument()

      expect(PrimaryNavigation).toHaveBeenCalledTimes(1)
      expect(PrimaryNavigation).toHaveBeenCalledWith({
        items: [
          [
            {
              title: 'Collections',
              version: 'vmock-umm-c',
              children: [
                {
                  title: 'All Collections',
                  to: '/collections'
                },
                {
                  to: '/drafts/collections',
                  title: 'Drafts'
                },
                {
                  to: '/templates/collections',
                  title: 'Templates'
                },
                {
                  title: 'Permissions',
                  to: '/permissions'
                }
              ]
            },
            {
              title: 'Variables',
              version: 'vmock-umm-v',
              children: [
                {
                  title: 'All Variables',
                  to: '/variables'
                },
                {
                  to: '/drafts/variables',
                  title: 'Drafts'
                }
              ]
            },
            {
              title: 'Services',
              version: 'vmock-umm-s',
              children: [
                {
                  title: 'All Services',
                  to: '/services'
                },
                {
                  to: '/drafts/services',
                  title: 'Drafts'
                }
              ]
            },
            {
              title: 'Tools',
              version: 'vmock-umm-t',
              children: [
                {
                  title: 'All Tools',
                  to: '/tools'
                },
                {
                  to: '/drafts/tools',
                  title: 'Drafts'
                }
              ]
            },
            {
              title: 'Order Options',
              children: [
                {
                  title: 'All Order Options',
                  to: '/order-options'
                }
              ]
            },
            {
              title: 'Groups',
              children: [
                {
                  title: 'All Groups',
                  to: '/groups'
                }
              ]
            }
          ],
          [
            {
              title: 'Admin',
              visible: false,
              children: [
                {
                  to: '/admin/groups',
                  title: 'System Groups',
                  visible: false
                }
              ]
            }
          ]
        ]
      }, {})
    })
  })

  describe('when clicking the My Providers button', () => {
    test('navigates to /providers', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup()

      const userDropdown = await screen.findByRole('button', { name: /User Name/ })

      await user.click(userDropdown)

      const link = await screen.findByRole('link', { name: /My Providers/ })

      await user.click(link)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/providers', { replace: false })

      expect(screen.getByText('This is some content')).toBeInTheDocument()
    })
  })

  describe('when in the production environment', () => {
    test('does not display the badge', () => {
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'production'
      }))

      setup()

      expect(screen.queryByTestId('env-badge')).not.toBeInTheDocument()
    })

    describe('when the prod warning is disabled', () => {
      test('does not display the warning', () => {
        vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'production'
        }))

        setup()

        expect(screen.queryByText('You are currently viewing/editing the production CMR environment')).not.toBeInTheDocument()
      })
    })

    describe('when the prod warning is enabled', () => {
      test('displays the warning', () => {
        vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'production',
          displayProdWarning: 'true'
        }))

        setup()

        expect(screen.getByText('You are currently viewing/editing the production CMR environment')).toBeInTheDocument()
      })
    })
  })

  describe('when in the SIT environment', () => {
    test('displays the badge', () => {
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'sit'
      }))

      setup()

      expect(screen.getByText('SIT')).toBeInTheDocument()
    })
  })

  describe('when in the UAT environment', () => {
    test('displays the badge', () => {
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'uat'
      }))

      setup()

      expect(screen.getByText('UAT')).toBeInTheDocument()
    })
  })

  describe('when in the development environment', () => {
    test('displays the badge', () => {
      vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
        env: 'development'
      }))

      setup()

      expect(screen.getByText('DEV')).toBeInTheDocument()
    })
  })
})
