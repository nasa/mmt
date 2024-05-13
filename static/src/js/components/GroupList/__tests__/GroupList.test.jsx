import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import { MemoryRouter } from 'react-router-dom'

import { DELETE_GROUP } from '@/js/operations/mutations/deleteGroup'
import { GET_GROUPS } from '@/js/operations/queries/getGroups'

import AppContext from '@/js/context/AppContext'
import NotificationsContext from '@/js/context/NotificationsContext'

import GroupList from '../GroupList'
import GroupSearchForm from '../../GroupSearchForm/GroupSearchForm'

vi.mock('../../../utils/errorLogger')
vi.mock('../../GroupSearchForm/GroupSearchForm')

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  initialEntries = ''
}) => {
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
  const mocks = [{
    request: {
      query: GET_GROUPS,
      variables: {
        params: {
          excludeTags: ['CMR'],
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
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MockedProvider mocks={overrideMocks || mocks}>
          <MemoryRouter initialEntries={[initialEntries]}>
            <Suspense>
              <GroupList />
            </Suspense>
          </MemoryRouter>
        </MockedProvider>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('GroupList', () => {
  describe('when getting list of groups results in a success', () => {
    test('renders a table with 2 groups', async () => {
      setup({})

      await waitForResponse()

      expect(GroupSearchForm).toBeCalledTimes(1)

      expect(screen.getByText('Showing 2 groups')).toBeInTheDocument()
      expect(screen.getByText('Test group 1')).toBeInTheDocument()
      expect(screen.getByText('Test group 2')).toBeInTheDocument()
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

      await waitForResponse()

      expect(GroupSearchForm).toBeCalledTimes(1)

      expect(screen.getByText('Showing 21-22 of 22 groups')).toBeInTheDocument()
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
                    offset: 0
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

        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[1])

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)
        await waitForResponse()

        expect(screen.getByText('Showing 1 groups')).toBeInTheDocument()
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
        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
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

        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
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
                  offset: 0
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

      await waitForResponse()

      expect(screen.getByText('No groups found')).toBeInTheDocument()
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
                  offset: 0
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
                  offset: 20
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

      await waitForResponse()

      const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')

      const paginationButton = within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Test group 21')
      })
    })
  })
})
