import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import { DELETE_GROUP } from '@/js/operations/mutations/deleteGroup'
import { GET_GROUPS } from '@/js/operations/queries/getGroups'

import NotificationsContext from '@/js/context/NotificationsContext'

import usePermissions from '@/js/hooks/usePermissions'

import GroupList from '../GroupList'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/hooks/usePermissions').mockReturnValue({ hasSystemGroup: true })

const mockGroups = {
  count: 2,
  items: [
    {
      description: 'This is a test record',
      id: 'Test-Native-Id-1',
      members: {
        count: 1
      },
      name: 'Test group 1',
      tag: 'MMT_2'
    },
    {
      description: 'This is a test record',
      id: 'Test-Native-Id-2',
      members: {
        count: 0
      },
      name: 'Test group 2',
      tag: 'MMT_2'
    }
  ]
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  initialEntries = '/groups?providers=MMT_2',
  hasSystemGroup = true
}) => {
  usePermissions.mockReturnValue({ hasSystemGroup })

  const mocks = [{
    request: {
      query: GET_GROUPS,
      variables: {
        params: {
          excludeTags: ['CMR'],
          limit: 20,
          name: '',
          offset: 0,
          tags: ['MMT_2']
        }
      }
    },
    result: {
      data: {
        groups: mockGroups
      }
    }
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MockedProvider mocks={overrideMocks || mocks}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Routes>
            <Route
              path="/groups"
              element={
                (
                  <Suspense>
                    <GroupList />
                  </Suspense>
                )
              }
            />
            <Route
              path="/admin/groups"
              element={
                (
                  <Suspense>
                    <GroupList isAdminPage />
                  </Suspense>
                )
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </NotificationsContext.Provider>
  )

  return {
    user
  }
}

describe('GroupList', () => {
  describe('when loading page for the first time', () => {
    test('alert banner asking users to select a provider is present', async () => {
      setup({
        initialEntries: '/groups',
        overrideMocks: [{
          request: {
            query: GET_GROUPS,
            variables: {
              params: {
                excludeTags: undefined,
                tags: [],
                limit: 20,
                name: '',
                offset: 0
              }
            }
          },
          result: {
            data: {
              groups: mockGroups
            }
          }
        }]
      })

      expect(await screen.findByText('Please select a provider')).toBeInTheDocument()
    })
  })

  describe('when getting list of groups results in a success', () => {
    test('renders a table with 2 groups', async () => {
      setup({})

      expect(await screen.findByText('Showing 2 groups')).toBeInTheDocument()
      expect(screen.getByText('Test group 1')).toBeInTheDocument()
      expect(screen.getByText('Test group 2')).toBeInTheDocument()
    })
  })

  describe('when loading a list of system groups', () => {
    test('renders a table with 2 groups', async () => {
      setup({
        initialEntries: '/admin/groups',
        overrideMocks: [{
          request: {
            query: GET_GROUPS,
            variables: {
              params: {
                excludeTags: undefined,
                tags: ['CMR'],
                limit: 20,
                name: '',
                offset: 0
              }
            }
          },
          result: {
            data: {
              groups: mockGroups
            }
          }
        }]
      })

      expect(await screen.findByText('Showing 2 groups')).toBeInTheDocument()
      expect(screen.getByText('Test group 1')).toBeInTheDocument()
      expect(screen.getByText('Test group 2')).toBeInTheDocument()

      expect(screen.queryByText('Provider')).not.toBeInTheDocument()
    })
  })

  describe('when parameters are in the URL', () => {
    test('renders a table of groups', async () => {
      const encodedUsers = Buffer.from(JSON.stringify([{
        id: 'testuser1',
        label: 'Test User 1'
      }])).toString('base64')

      setup({
        initialEntries: `/groups?name=Test+Name&providers=MMT_1&members=${encodedUsers}&page=2`,
        overrideMocks: [{
          request: {
            query: GET_GROUPS,
            variables: {
              params: {
                excludeTags: ['CMR'],
                limit: 20,
                name: 'Test Name',
                offset: 20,
                tags: ['MMT_1'],
                userIds: ['testuser1']
              }
            }
          },
          result: {
            data: {
              groups: {
                count: 22,
                items: [
                  {
                    description: 'This is a test record',
                    id: 'Test-Native-Id-1',
                    members: {
                      count: 1
                    },
                    name: 'Test group 1',
                    tag: 'MMT_2'
                  },
                  {
                    description: 'This is a test record',
                    id: 'Test-Native-Id-2',
                    members: {
                      count: 0
                    },
                    name: 'Test group 2',
                    tag: 'MMT_2'
                  }
                ]
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Showing 21-22 of 22 groups')).toBeInTheDocument()
      expect(screen.getByText('Test group 1')).toBeInTheDocument()
      expect(screen.getByText('Test group 2')).toBeInTheDocument()
    })
  })

  describe('when clicking the delete button', () => {
    describe('when clicking Yes on the delete modal results in a success', () => {
      test('deletes the group and hides the modal', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_GROUP,
                variables: {
                  id: 'Test-Native-Id-2'
                }
              },
              result: {
                data: {
                  deleteGroup: true
                }
              }
            },
            {
              request: {
                query: GET_GROUPS,
                variables: {
                  params: {
                    excludeTags: ['CMR'],
                    limit: 20,
                    name: '',
                    offset: 0,
                    tags: ['MMT_2']
                  }
                }
              },
              result: {
                data: {
                  groups: {
                    count: 1,
                    items: [
                      {
                        description: 'This is a test record',
                        id: 'Test-Native-Id-1',
                        members: {
                          count: 1
                        },
                        name: 'Test group 1',
                        tag: 'MMT_2'
                      }
                    ]
                  }
                }
              }
            }
          ]
        })

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[1])

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(await screen.findByText('Showing 1 groups')).toBeInTheDocument()
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('does not delete the group', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_GROUP,
                variables: {
                  id: 'Test-Native-Id-2'
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[1])

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('Showing 2 groups')).toBeInTheDocument()
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('hides delete modal', async () => {
        const { user } = setup({})

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[1])

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.getByText('Showing 2 groups')).toBeInTheDocument()
        expect(screen.queryByText('Are you sure you want to delete this group?')).not.toBeInTheDocument()
      })
    })
  })

  describe('when there are no group found', () => {
    test('render a table with No group found message', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_GROUPS,
              variables: {
                params: {
                  excludeTags: ['CMR'],
                  limit: 20,
                  name: '',
                  offset: 0,
                  tags: ['MMT_2']
                }
              }
            },
            result: {
              data: {
                groups: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText('No groups found')).toBeInTheDocument()
    })
  })

  describe('when groups list has more than 20 options', () => {
    test('renders the pagination component', async () => {
      const { user } = setup({
        overrideMocks: [
          {
            request: {
              query: GET_GROUPS,
              variables: {
                params: {
                  excludeTags: ['CMR'],
                  limit: 20,
                  name: '',
                  offset: 0,
                  tags: ['MMT_2']
                }
              }
            },
            result: {
              data: {
                groups: {
                  count: 25,
                  items: Array.from(Array(20)).map((item, index) => ({
                    description: 'This is a test record',
                    id: `Test-Native-Id-${index + 1}`,
                    members: {
                      count: 1
                    },
                    name: `Test group ${index + 1}`,
                    tag: 'MMT_2'
                  }))
                }
              }
            }
          }, {
            request: {
              query: GET_GROUPS,
              variables: {
                params: {
                  excludeTags: ['CMR'],
                  limit: 20,
                  name: '',
                  offset: 20,
                  tags: ['MMT_2']
                }
              }
            },
            result: {
              data: {
                groups: {
                  count: 25,
                  items: Array.from(Array(5)).map((item, index) => ({
                    description: 'This is a test record',
                    id: `Test-Native-Id-${index + 20 + 1}`,
                    members: {
                      count: 1
                    },
                    name: `Test group ${index + 20 + 1}`,
                    tag: 'MMT_2'
                  }))
                }
              }
            }
          }
        ]
      })

      const pagination = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')

      const paginationButton = within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      const paginationCells = await screen.findAllByRole('cell')
      const firstCell = paginationCells[0]
      expect(firstCell.textContent).toContain('Test group 21')
    })
  })

  describe('when the user does not have system group create permission', () => {
    test('does not render the actions column', async () => {
      setup({
        hasSystemGroup: false,
        initialEntries: '/admin/groups',
        overrideMocks: [{
          request: {
            query: GET_GROUPS,
            variables: {
              params: {
                excludeTags: undefined,
                tags: ['CMR'],
                limit: 20,
                name: '',
                offset: 0
              }
            }
          },
          result: {
            data: {
              groups: mockGroups
            }
          }
        }]
      })

      expect(await screen.findByText('Showing 2 groups')).toBeInTheDocument()

      expect(screen.queryByText('Actions')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Edit Button Edit' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Delete Button Delete' })).not.toBeInTheDocument()
    })
  })
})
