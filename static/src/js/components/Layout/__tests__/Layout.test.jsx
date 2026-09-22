import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router'
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

beforeEach(() => {
  vi.resetAllMocks()
})

// `vi.mock` factories are hoisted above imports/module scope, so to
// hang on to the *real* useNavigate for restoring between tests we
// need to stash it on a `vi.hoisted` object rather than a plain
// module-level variable.
const mocks = vi.hoisted(() => ({
  actualUseNavigate: undefined
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  mocks.actualUseNavigate = actual.useNavigate

  return {
    ...actual,
    // Defaults to the real implementation so every test that
    // doesn't care about navigation keeps working normally.
    // Individual tests can override via
    // router.useNavigate.mockImplementation(...), and the afterEach
    // below restores the real implementation afterward.
    useNavigate: vi.fn(actual.useNavigate)
  }
})

const setup = ({
  loggedIn = false,
  hasSystemGroup = true,
  hasSystemKeywords = true
} = {}) => {
  usePermissions.mockReturnValue({
    hasSystemGroup,
    hasSystemKeywords
  })

  vi.spyOn(getConfig, 'getUmmVersionsConfig').mockImplementation(() => ({
    ummC: 'mock-umm-c',
    ummCit: 'mock-umm-cit',
    ummS: 'mock-umm-s',
    ummT: 'mock-umm-t',
    ummV: 'mock-umm-v',
    ummVis: 'mock-umm-vis'
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
  afterEach(() => {
    // Restore the real useNavigate implementation and wipe call
    // history so a mockImplementation override set in one test
    // never leaks into the next.
    router.useNavigate.mockReset()
    router.useNavigate.mockImplementation(mocks.actualUseNavigate)
  })

  test('renders the content to the React Router Outlet', async () => {
    setup({
      hasSystemGroup: true,
      hasSystemKeywords: true
    })

    expect(screen.getByText('This is some content')).toBeInTheDocument()

    expect(usePermissions).toHaveBeenCalledTimes(1)
    expect(usePermissions).toHaveBeenCalledWith({
      systemGroup: ['read'],
      systemKeywords: ['read']
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
            title: 'Visualizations',
            version: 'vmock-umm-vis',
            children: [
              {
                title: 'All Visualizations',
                to: '/visualizations'
              },
              {
                title: 'Drafts',
                to: '/drafts/visualizations'
              }
            ]
          },
          {
            title: 'Citations',
            version: 'vmock-umm-cit',
            children: [
              {
                title: 'All Citations',
                to: '/citations'
              },
              {
                title: 'Drafts',
                to: '/drafts/citations'
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
              },
              {
                to: '/admin/keywordmanager',
                title: 'Keyword Manager',
                visible: true
              }
            ]
          }
        ]
      ]
    }, {})
  })

  describe('when the user does not have system group or system keywords permissions', () => {
    test('does not render the admin links', async () => {
      setup({
        loggedIn: true,
        hasSystemGroup: false,
        hasSystemKeywords: false
      })

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
              title: 'Visualizations',
              version: 'vmock-umm-vis',
              children: [
                {
                  title: 'All Visualizations',
                  to: '/visualizations'
                },
                {
                  title: 'Drafts',
                  to: '/drafts/visualizations'
                }
              ]
            },
            {
              title: 'Citations',
              version: 'vmock-umm-cit',
              children: [
                {
                  title: 'All Citations',
                  to: '/citations'
                },
                {
                  title: 'Drafts',
                  to: '/drafts/citations'
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
                },
                {
                  to: '/admin/keywordmanager',
                  title: 'Keyword Manager',
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
    test.only('navigates to /providers', async () => {
      const { user } = setup()

      const userDropdown = await screen.findByRole('button', { name: /User Name/ })
      await user.click(userDropdown)

      const link = await screen.findByRole('link', { name: /My Providers/ })
      expect(link).toHaveAttribute('href', '/providers')

      // await user.click(link)
      // screen.debug()
      // expect(await screen.findByText('This is some content')).toBeInTheDocument()
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
