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

import OrderOptionForm from '../OrderOptionForm'

import Providers from '../../../providers/Providers/Providers'

import errorLogger from '../../../utils/errorLogger'

import { CREATE_ORDER_OPTION } from '../../../operations/mutations/createOrderOption'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'
import { UPDATE_ORDER_OPTION } from '../../../operations/mutations/updateOrderOption'

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
  mocks,
  pageUrl
}) => {
  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <Providers>
        <MockedProvider
          mocks={mocks}
        >
          <MemoryRouter initialEntries={[pageUrl]}>
            <Routes>
              <Route
                path="/order-options"
              >
                <Route
                  element={
                    (
                      <Suspense>
                        <OrderOptionForm />
                      </Suspense>
                    )
                  }
                  path="new"
                />
                <Route
                  path=":conceptId/edit"
                  element={
                    (
                      <Suspense>
                        <OrderOptionForm />
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

describe('OrderOptionForm', () => {
  describe('when create a new Order Option', () => {
    describe('when filling out the form and submitting', () => {
      test('should navigate to /order-options/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup(
          {
            pageUrl: '/order-options/new',
            mocks: [{
              request: {
                query: CREATE_ORDER_OPTION,
                variables: {
                  deprecated: false,
                  name: 'Test Name',
                  description: 'Test Description',
                  form: 'Test Form',
                  scope: 'PROVIDER',
                  providerId: 'MMT_2'
                }
              },
              result: {
                data: {
                  createOrderOption: {
                    conceptId: 'OO1000000-MMT',
                    revisionId: '1'
                  }
                }
              }
            }, {
              request: {
                query: GET_ORDER_OPTION,
                variables: {
                  params: {
                    conceptId: 'OO1000000-MMT'
                  }
                }
              },
              result: {
                data: {
                  orderOption: {
                    conceptId: 'OO1000000-MMT'
                  }
                }
              }
            }]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const formField = screen.getByRole('textbox', { name: 'Form XML' })

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')
        await user.type(formField, 'Test Form')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1000000-MMT')
      })
    })

    describe('when creating a new Order Option results in an error', () => {
      test('should call error logger', async () => {
        const { user } = setup(
          {
            pageUrl: '/order-options/new',
            mocks: [{
              request: {
                query: CREATE_ORDER_OPTION,
                variables: {
                  deprecated: false,
                  name: 'Test Name',
                  description: 'Test Description',
                  form: 'Test Form',
                  scope: 'PROVIDER',
                  providerId: 'MMT_2'
                }
              },
              error: new Error('An error occurred')
            }]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const formField = screen.getByRole('textbox', { name: 'Form XML' })

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')
        await user.type(formField, 'Test Form')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error creating order option', 'OrderOptionForm: createOrderOptionMutation')
      })
    })

    describe('when filling out the form and clicking on Clear', () => {
      test('should clear the form', async () => {
        const { user } = setup({
          pageUrl: '/order-options/new'
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

  describe('when getting and updating Order Option', () => {
    describe('when getting a order option and updating results in success', () => {
      test('should navigate to /order-options/id', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup(
          {
            pageUrl: '/order-options/OO1000000-MMT/edit',
            mocks: [{
              request: {
                query: GET_ORDER_OPTION,
                variables: { params: { conceptId: 'OO1000000-MMT' } }
              },
              result: {
                data: {
                  orderOption: {
                    conceptId: 'OO1000000-MMT',
                    deprecated: null,
                    description: 'Test Description',
                    form: 'Test Form',
                    name: 'Test Name',
                    nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                    revisionId: '1',
                    revisionDate: '2024-04-23T15:03:34.399Z',
                    scope: 'PROVIDER',
                    sortKey: null,
                    __typename: 'OrderOption'
                  }
                }
              }
            },
            {
              request: {
                query: UPDATE_ORDER_OPTION,
                variables: {
                  deprecated: false,
                  description: 'Test Description',
                  form: 'Test Form',
                  name: 'Test NameUpdated Name',
                  scope: 'PROVIDER',
                  providerId: 'MMT_2',
                  nativeId: 'dce1859e-774c-4561-9451-fc9d77906015'
                }
              },
              result: {
                data: {
                  updateOrderOption: {
                    conceptId: 'OO1000000-MMT',
                    revisionId: '2'
                  }
                }
              }
            },
            {
              request: {
                query: GET_ORDER_OPTION,
                variables: { params: { conceptId: 'OO1000000-MMT' } }
              },
              result: {
                data: {
                  orderOption: {
                    conceptId: 'OO1000000-MMT',
                    deprecated: null,
                    description: 'Test Description',
                    form: 'Test Form',
                    name: 'Test Name',
                    nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                    revisionId: '1',
                    revisionDate: '2024-04-23T15:03:34.399Z',
                    scope: 'PROVIDER',
                    sortKey: null,
                    __typename: 'OrderOption'
                  }
                }
              }
            }
            ]
          }
        )

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1000000-MMT')
      })
    })

    describe('when getting a order option and updating results in a failure', () => {
      test('should call errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          pageUrl: '/order-options/OO1000000-MMT/edit',
          mocks: [{
            request: {
              query: GET_ORDER_OPTION,
              variables: { params: { conceptId: 'OO1000000-MMT' } }
            },
            result: {
              data: {
                orderOption: {
                  conceptId: 'OO1000000-MMT',
                  deprecated: true,
                  description: 'Test Description',
                  form: 'Test Form',
                  name: 'Test Name',
                  nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                  revisionId: '1',
                  revisionDate: '2024-04-23T15:03:34.399Z',
                  scope: 'PROVIDER',
                  sortKey: 'Sort',
                  __typename: 'OrderOption'
                }
              }
            }
          },
          {
            request: {
              query: UPDATE_ORDER_OPTION,
              variables: {
                deprecated: true,
                description: 'Test Description',
                form: 'Test Form',
                name: 'Test NameUpdated Name',
                sortKey: 'Sort',
                scope: 'PROVIDER',
                providerId: 'MMT_2',
                nativeId: 'dce1859e-774c-4561-9451-fc9d77906015'
              }
            },
            error: new Error('An error occurred')
          }
          ]
        })

        await waitForResponse()

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error updating order option', 'OrderOptionForm: updateOrderOptionMutation')
      })
    })
  })
})
