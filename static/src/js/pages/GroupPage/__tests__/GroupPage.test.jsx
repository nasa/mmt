import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import GroupPage from '../GroupPage'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary'

import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'

import { DELETE_GROUP } from '../../../operations/mutations/deleteGroup'
import { GET_GROUP } from '../../../operations/queries/getGroup'
import { GET_GROUPS } from '../../../operations/queries/getGroups'

vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mockGroup = {
    id: '1234-abcd-5678-efgh',
    description: 'Mock group description',
    members: {
      count: 1,
      items: [{
        id: 'test.user',
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test@example.com',
        __typename: 'GroupMember'
      }]
    },
    name: 'Mock group',
    tag: 'MMT_2'
  }

  const mocks = [{
    request: {
      query: GET_GROUP,
      variables: {
        params: {
          id: '1234-abcd-5678-efgh'
        }
      }
    },
    result: {
      data: {
        group: mockGroup
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
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <MemoryRouter initialEntries={['/groups/1234-abcd-5678-efgh']}>
            <Routes>
              <Route
                path="/groups"
              >
                <Route
                  path=":id"
                  element={
                    (
                      <ErrorBoundary>
                        <Suspense>
                          <GroupPage />
                        </Suspense>
                      </ErrorBoundary>
                    )
                  }
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('GroupPage', () => {
  describe('when showing the header', () => {
    test('renders the header', async () => {
      setup({})

      await waitForResponse()

      expect(screen.queryByText('Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'Mock group' })).toBeInTheDocument()
    })
  })

  describe('when the api throws an error ', () => {
    test('renders an error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup({
        overrideMocks: [
          {
            request: {
              query: GET_GROUP,
              variables: {
                params: {
                  id: '1234-abcd-5678-efgh'
                }
              }
            },
            result: {
              data: {
                group: null
              },
              errors: [new GraphQLError('An error occurred')]
            }
          }
        ]
      })

      await waitForResponse()

      await waitFor(() => {
        expect(screen.queryByText('Sorry!')).toBeInTheDocument()
        expect(screen.queryByText('An error occurred')).toBeInTheDocument()
      })
    })
  })

  describe('when clicking the delete button', () => {
    describe('when the group has members', () => {
      test('the delete button is disabled', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        setup({})

        await waitForResponse()

        const deleteLink = screen.getByRole('button', { name: 'A trash can icon Delete' })
        expect(deleteLink).toHaveAttribute('disabled')
      })
    })

    describe('when clicking Yes on the delete modal results in a success', () => {
      test('deletes the group and hides the modal', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          overrideMocks: [
            {
              request: {
                query: GET_GROUP,
                variables: {
                  params: {
                    id: '1234-abcd-5678-efgh'
                  }
                }
              },
              result: {
                data: {
                  group: {
                    id: '1234-abcd-5678-efgh',
                    description: 'Mock group description',
                    members: {
                      count: 0,
                      items: []
                    },
                    name: 'Mock group',
                    tag: 'MMT_2'
                  }
                }
              }
            },
            {
              request: {
                query: DELETE_GROUP,
                variables: {
                  id: '1234-abcd-5678-efgh'
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
                    name: ''
                  }
                }
              },
              result: {
                data: {
                  groups: {
                    count: 1,
                    items: [
                      {
                        id: '1234-abcd-5678-efgh',
                        description: 'Mock group description',
                        members: {
                          count: 1,
                          items: [{
                            id: 'test.user',
                            firstName: 'Test',
                            lastName: 'User',
                            emailAddress: 'test@example.com',
                            __typename: 'GroupMember'
                          }]
                        },
                        name: 'Mock group',
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

        const deleteLink = screen.getByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })

        await user.click(yesButton)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/groups')
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('does not delete the group', async () => {
        const { user } = setup({
          overrideMocks: [
            {
              request: {
                query: GET_GROUP,
                variables: {
                  params: {
                    id: '1234-abcd-5678-efgh'
                  }
                }
              },
              result: {
                data: {
                  group: {
                    id: '1234-abcd-5678-efgh',
                    description: 'Mock group description',
                    members: {
                      count: 0,
                      items: []
                    },
                    name: 'Mock group',
                    tag: 'MMT_2'
                  }
                }
              }
            },
            {
              request: {
                query: DELETE_GROUP,
                variables: {
                  id: '1234-abcd-5678-efgh'
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })
        await waitForResponse()

        const deleteLink = screen.getByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(screen.queryByText('Are you sure you want to delete this group?')).not.toBeInTheDocument()
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('hides delete modal', async () => {
        const { user } = setup({
          overrideMocks: [
            {
              request: {
                query: GET_GROUP,
                variables: {
                  params: {
                    id: '1234-abcd-5678-efgh'
                  }
                }
              },
              result: {
                data: {
                  group: {
                    id: '1234-abcd-5678-efgh',
                    description: 'Mock group description',
                    members: {
                      count: 0,
                      items: []
                    },
                    name: 'Mock group',
                    tag: 'MMT_2'
                  }
                }
              }
            }
          ]
        })

        await waitForResponse()

        const deleteLink = screen.getByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this group?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.queryByText('Are you sure you want to delete this group?')).not.toBeInTheDocument()
      })
    })
  })
})
