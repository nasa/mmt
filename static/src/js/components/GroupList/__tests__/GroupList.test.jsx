import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'

import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import GroupList from '../GroupList'

import { DELETE_GROUP } from '../../../operations/mutations/deleteGroup'
import { GET_GROUPS } from '../../../operations/queries/getGroups'

vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideMocks = false
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
          <BrowserRouter initialEntries="">
            <Suspense>
              <GroupList />
            </Suspense>
          </BrowserRouter>
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
    test('render a table with 2 groups', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('Showing 2 groups')).toBeInTheDocument()
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
                  tags: ['MMT_2']
                }
              }
            },
            result: {
              data: {
                groups: {
                  count: 25,
                  // Pagination is fake for groups, so we have to load more than 1 page of items in the response
                  items: Array.from(Array(25)).map((item, index) => ({
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
