import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import Providers from '@/js/providers/Providers/Providers'

import errorLogger from '@/js/utils/errorLogger'

import { CREATE_ORDER_OPTION } from '@/js/operations/mutations/createOrderOption'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'
import { UPDATE_ORDER_OPTION } from '@/js/operations/mutations/updateOrderOption'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import OrderOptionForm from '../OrderOptionForm'

vi.mock('@/js/utils/errorLogger')

vi.mock('jsonwebtoken', async () => ({
  default: {
    decode: vi.fn().mockReturnValue({
      edlProfile: {
        name: 'Test User'
      }
    })
  }
}))

const setup = ({
  mocks = [],
  pageUrl
}) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider mocks={
        [{
          request: {
            query: GET_AVAILABLE_PROVIDERS,
            variables: {
              params: {
                limit: 500,
                // Don't have an easy way to get a real uid into the context here
                permittedUser: undefined,
                target: 'PROVIDER_CONTEXT'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [{
                  conceptId: 'mock-id',
                  providerIdentity: {
                    target: 'PROVIDER_CONTEXT',
                    provider_id: 'MMT_2'
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
            <Route path="/order-options">
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
  )

  return {
    user
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
                    conceptId: 'OO1000000-MMT_2',
                    revisionId: '1'
                  }
                }
              }
            },
            {
              request: {
                query: GET_ORDER_OPTION,
                variables: {
                  params: {
                    conceptId: 'OO1000000-MMT_2'
                  }
                }
              },
              result: {
                data: {
                  orderOption: {
                    conceptId: 'OO1000000-MMT_2'
                  }
                }
              }
            }]
          }
        )

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const formField = screen.getByRole('textbox', { name: 'Form XML' })

        // Verify inline error does not appear on page load, only when visiting the field
        // and leaving the field does it appear.
        expect(screen.queryByText('must have required property \'name\'')).not.toBeInTheDocument()
        await user.click(nameField)
        await user.click(descriptionField)
        expect(screen.getByText('must have required property \'name\'')).toBeInTheDocument()

        await user.type(descriptionField, 'Test Description')
        await user.type(formField, 'Test Form')

        // Verify button is disabled since Name field has not been filled out yet
        const submitButton = screen.getByRole('button', { name: 'Submit' })
        expect(submitButton).toBeDisabled()

        await user.type(nameField, 'Test Name')
        await user.click(submitButton)

        const modal = screen.getByRole('dialog')
        const modalButton = within(modal).getByRole('button', {
          name: 'Submit'
        })
        await user.click(modalButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1000000-MMT_2')
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

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        const descriptionField = screen.getByRole('textbox', { name: 'Description' })
        const formField = screen.getByRole('textbox', { name: 'Form XML' })

        await user.type(nameField, 'Test Name')
        await user.type(descriptionField, 'Test Description')
        await user.type(formField, 'Test Form')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        const modal = screen.getByRole('dialog')
        const modalButton = within(modal).getByRole('button', { name: 'Submit' })
        await user.click(modalButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          'Error creating order option',
          'OrderOptionForm: createOrderOptionMutation'
        )
      })
    })

    describe('when filling out the form and clicking on Clear', () => {
      test('should clear the form', async () => {
        const { user } = setup({
          pageUrl: '/order-options/new'
        })

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
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
            pageUrl: '/order-options/OO1000000-MMT_2/edit',
            mocks: [{
              request: {
                query: GET_ORDER_OPTION,
                variables: { params: { conceptId: 'OO1000000-MMT_2' } }
              },
              result: {
                data: {
                  orderOption: {
                    associationDetails: {},
                    conceptId: 'OO1000000-MMT_2',
                    collections: {
                      count: 0,
                      items: []
                    },
                    deprecated: null,
                    description: 'Test Description',
                    form: 'Test Form',
                    name: 'Test Name',
                    nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                    pageTitle: 'Test Name',
                    providerId: 'MMT_2',
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
                    conceptId: 'OO1000000-MMT_2',
                    revisionId: '2'
                  }
                }
              }
            },
            {
              request: {
                query: GET_ORDER_OPTION,
                variables: { params: { conceptId: 'OO1000000-MMT_2' } }
              },
              result: {
                data: {
                  orderOption: {
                    associationDetails: {},
                    conceptId: 'OO1000000-MMT_2',
                    collections: {
                      count: 0,
                      items: []
                    },
                    deprecated: null,
                    description: 'Test Description',
                    form: 'Test Form',
                    name: 'Test Name',
                    nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                    pageTitle: 'Test Name',
                    providerId: 'MMT_2',
                    revisionId: '1',
                    revisionDate: '2024-04-23T15:03:34.399Z',
                    scope: 'PROVIDER',
                    sortKey: null,
                    __typename: 'OrderOption'
                  }
                }
              }
            }]
          }
        )

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1000000-MMT_2')
      })
    })

    describe('when getting a order option and updating results in a failure', () => {
      test('should call errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          pageUrl: '/order-options/OO1000000-MMT_2/edit',
          mocks: [{
            request: {
              query: GET_ORDER_OPTION,
              variables: { params: { conceptId: 'OO1000000-MMT_2' } }
            },
            result: {
              data: {
                orderOption: {
                  associationDetails: {},
                  conceptId: 'OO1000000-MMT_2',
                  collections: {
                    count: 0,
                    items: []
                  },
                  deprecated: true,
                  description: 'Test Description',
                  form: 'Test Form',
                  name: 'Test Name',
                  nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                  pageTitle: 'Test Name',
                  providerId: 'MMT_2',
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
          }]
        })

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          'Error updating order option',
          'OrderOptionForm: updateOrderOptionMutation'
        )
      })
    })
  })
})
