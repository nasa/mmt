import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { Cookies, CookiesProvider } from 'react-cookie'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import Providers from '@/js/providers/Providers/Providers'

import errorLogger from '@/js/utils/errorLogger'

import { CREATE_GROUP } from '@/js/operations/mutations/createGroup'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { UPDATE_GROUP } from '@/js/operations/mutations/updateGroup'
import { GET_ACLS } from '@/js/operations/queries/getAcls'

import GroupForm from '../GroupForm'

vi.mock('../../../utils/errorLogger')

global.fetch = vi.fn()

let expires = new Date()
expires.setMinutes(expires.getMinutes() + 15)
expires = new Date(expires)

const cookie = new Cookies(
  {
    loginInfo: ({
      providerId: 'MMT_2',
      name: 'User Name',
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires.valueOf()
      }
    })
  }
)
cookie.HAS_DOCUMENT_COOKIE = false

const setup = ({
  mocks = [],
  pageUrl
}) => {
  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <Providers>
        <MockedProvider
          mocks={
            [
              {
                request: {
                  query: GET_ACLS,
                  variables: {
                    params: {
                      limit: 500,
                      permittedUser: undefined,
                      target: 'PROVIDER_CONTEXT'
                    }
                  }
                },
                result: {
                  data: {
                    acls: {
                      items: [{
                        groupPermissions: [{
                          permissions: [
                            'read'
                          ],
                          group_id: '1234-abcd-5678-efgh'
                        }],
                        providerIdentity: {
                          target: 'PROVIDER_CONTEXT',
                          provider_id: 'MMT_2'
                        },
                        acl: {
                          group_permissions: [{
                            permissions: [
                              'read'
                            ],
                            group_id: '1234-abcd-5678-efgh'
                          }],
                          provider_identity: {
                            target: 'PROVIDER_CONTEXT',
                            provider_id: 'MMT_2'
                          }
                        }
                      }]
                    }
                  }
                }
              },
              ...mocks]
          }
        >
          <MemoryRouter initialEntries={[pageUrl]}>
            <Routes>
              <Route
                path="/groups"
              >
                <Route
                  element={
                    (
                      <Suspense>
                        <GroupForm />
                      </Suspense>
                    )
                  }
                  path="new"
                />
                <Route
                  path=":id/edit"
                  element={
                    (
                      <Suspense>
                        <GroupForm />
                      </Suspense>
                    )
                  }
                />
              </Route>
              <Route
                path="/admin/groups"
              >
                <Route
                  element={
                    (
                      <Suspense>
                        <GroupForm isAdmin />
                      </Suspense>
                    )
                  }
                  path="new"
                />
                <Route
                  path=":id/edit"
                  element={
                    (
                      <Suspense>
                        <GroupForm isAdmin />
                      </Suspense>
                    )
                  }
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </Providers>
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('GroupForm', () => {
  describe('when create a new Group', () => {
    describe('when filling out the form and submitting', () => {
      test('should navigate to /groups/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve([{
            id: 'testuser1',
            label: 'Test User 1'
          }, {
            id: 'testuser2',
            label: 'Test User 2'
          }])
        })

        const { user } = setup(
          {
            pageUrl: '/groups/new',
            mocks: [{
              request: {
                query: CREATE_GROUP,
                variables: {
                  description: 'Test Description',
                  members: 'testuser1, testuser2',
                  name: 'Test Name',
                  tag: 'MMT_2'
                }
              },
              result: {
                data: {
                  createGroup: {
                    id: '1234-abcd-5678-efgh',
                    description: 'Test Description',
                    name: 'Test Name',
                    tag: 'MMT_2'
                  }
                }
              }
            }, {
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
                    id: '1234-abcd-5678-efgh'
                  }
                }
              }
            }]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const membersField = screen.getAllByRole('combobox').at(1)

        const providerField = screen.getAllByRole('combobox').at(0)
        await user.click(providerField)
        const option = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option)

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')

        // Select one user
        await user.click(membersField)
        await user.type(membersField, 'test')
        const option1 = screen.getByRole('option', { name: 'Test User 1 testuser1' })
        await user.click(option1)

        // Select second user
        await user.click(membersField)
        await user.type(membersField, 'test')
        const option2 = screen.getByRole('option', { name: 'Test User 2 testuser2' })
        await user.click(option2)

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/groups/1234-abcd-5678-efgh')
      })
    })

    describe('when filling out the form and submitting a system group', () => {
      test('should navigate to /admin/groups/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve([{
            id: 'testuser1',
            label: 'Test User 1'
          }, {
            id: 'testuser2',
            label: 'Test User 2'
          }])
        })

        const { user } = setup(
          {
            pageUrl: '/admin/groups/new',
            mocks: [{
              request: {
                query: CREATE_GROUP,
                variables: {
                  description: 'Test Description',
                  members: 'testuser1',
                  name: 'Test Name',
                  tag: 'CMR'
                }
              },
              result: {
                data: {
                  createGroup: {
                    id: '1234-abcd-5678-efgh',
                    description: 'Test Description',
                    name: 'Test Name',
                    tag: 'MMT_2'
                  }
                }
              }
            }, {
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
                    id: '1234-abcd-5678-efgh'
                  }
                }
              }
            }]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const membersField = screen.getByRole('combobox')

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')

        await user.click(membersField)
        await user.type(membersField, 'test')
        const option = screen.getByRole('option', { name: 'Test User 1 testuser1' })
        await user.click(option)

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/admin/groups/1234-abcd-5678-efgh')
      })
    })

    describe('when creating a new Group results in an error', () => {
      test('should call error logger', async () => {
        const { user } = setup(
          {
            pageUrl: '/groups/new',
            mocks: [{
              request: {
                query: CREATE_GROUP,
                variables: {
                  description: 'Test Description',
                  members: '',
                  name: 'Test Name',
                  tag: 'MMT_2'
                }
              },
              error: new Error('An error occurred')
            }]
          }
        )

        await waitForResponse()

        const providerField = screen.getAllByRole('combobox').at(0)
        await user.click(providerField)
        const option = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option)

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error creating group', 'GroupForm: createGroupMutation')
      })
    })

    describe('when filling out the form and clicking on Clear', () => {
      test('should clear the form', async () => {
        const { user } = setup({
          pageUrl: '/groups/new'
        })
        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Test Name')

        const clearButton = screen.getByRole('button', { name: 'Clear' })
        await user.click(clearButton)

        expect(screen.getByRole('textbox', { name: 'Name' }))
      })
    })
  })

  describe('when getting and updating Group', () => {
    describe('when getting a group and updating results in success', () => {
      test('should navigate to /groups/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup(
          {
            pageUrl: '/groups/1234-abcd-5678-efgh/edit',
            mocks: [{
              request: {
                query: GET_GROUP,
                variables: { params: { id: '1234-abcd-5678-efgh' } }
              },
              result: {
                data: {
                  group: {
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
                }
              }
            },
            {
              request: {
                query: UPDATE_GROUP,
                variables: {
                  description: 'Mock group description',
                  id: '1234-abcd-5678-efgh',
                  members: 'test.user',
                  name: 'Mock groupMock group updated',
                  tag: 'MMT_2'
                }
              },
              result: {
                data: {
                  updateGroup: {
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
                    name: 'Mock group updated',
                    tag: 'MMT_2'
                  }
                }
              }
            },
            {
              request: {
                query: GET_GROUP,
                variables: { params: { id: '1234-abcd-5678-efgh' } }
              },
              result: {
                data: {
                  group: {
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
                    name: 'Mock group updated',
                    tag: 'MMT_2'
                  }
                }
              }
            }
            ]
          }
        )

        await waitForResponse()
        await waitForResponse()

        const providerField = screen.getAllByRole('combobox').at(0)
        await user.click(providerField)
        const option = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option)

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Mock group updated')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/groups/1234-abcd-5678-efgh')
      })
    })

    describe('when getting a system group and updating results in success', () => {
      test('should navigate to /admin/groups/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup(
          {
            pageUrl: '/admin/groups/1234-abcd-5678-efgh/edit',
            mocks: [{
              request: {
                query: GET_GROUP,
                variables: { params: { id: '1234-abcd-5678-efgh' } }
              },
              result: {
                data: {
                  group: {
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
                    tag: 'CMR'
                  }
                }
              }
            },
            {
              request: {
                query: UPDATE_GROUP,
                variables: {
                  description: 'Mock group description',
                  id: '1234-abcd-5678-efgh',
                  members: 'test.user',
                  name: 'Mock groupMock group updated',
                  tag: 'CMR'
                }
              },
              result: {
                data: {
                  updateGroup: {
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
                    name: 'Mock group updated',
                    tag: 'CMR'
                  }
                }
              }
            },
            {
              request: {
                query: GET_GROUP,
                variables: { params: { id: '1234-abcd-5678-efgh' } }
              },
              result: {
                data: {
                  group: {
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
                    name: 'Mock group updated',
                    tag: 'CMR'
                  }
                }
              }
            }
            ]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Mock group updated')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/admin/groups/1234-abcd-5678-efgh')
      })
    })

    describe('when getting a group and updating results in a failure', () => {
      test('should call errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          pageUrl: '/groups/1234-abcd-5678-efgh/edit',
          mocks: [{
            request: {
              query: GET_GROUP,
              variables: { params: { id: '1234-abcd-5678-efgh' } }
            },
            result: {
              data: {
                group: {
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
              }
            }
          },
          {
            request: {
              query: UPDATE_GROUP,
              variables: {
                description: 'Mock group description',
                id: '1234-abcd-5678-efgh',
                members: 'test.user',
                name: 'Mock groupMock group updated',
                tag: 'MMT_2'
              }
            },
            error: new Error('An error occurred')
          }
          ]
        })

        await waitForResponse()
        await waitForResponse()

        const providerField = screen.getAllByRole('combobox').at(0)
        await user.click(providerField)
        const option = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option)

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Mock group updated')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error updating group', 'GroupForm: updateGroupMutation')
      })
    })
  })
})
