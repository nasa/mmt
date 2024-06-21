import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  within
} from '@testing-library/react'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import userEvent from '@testing-library/user-event'

import { GET_GROUP_ACLS } from '@/js/operations/queries/getGroupAcls'

import AssociatedCollectionPermissionsTable from '../AssociatedCollectionPermissionsTable'

const setup = ({
  overrideMocks = false
}) => {
  const mockGroup = {
    __typename: 'Group',
    id: '1234',
    acls: {
      __typename: 'AclList',
      count: 5,
      items: [
        {
          __typename: 'Acl',
          name: 'Collection Permission 1',
          catalogItemIdentity: {
            __typename: 'CatalogItemIdentity',
            providerId: 'MMT_2'
          },
          conceptId: 'ACL1200214173-CMR'
        },
        {
          __typename: 'Acl',
          name: 'Collection Permission 2',
          catalogItemIdentity: {
            __typename: 'CatalogItemIdentity',
            providerId: 'MMT_2'
          },
          conceptId: 'ACL1200214640-CMR'
        },
        {
          __typename: 'Acl',
          name: 'Test123',
          catalogItemIdentity: {
            __typename: 'CatalogItemIdentity',
            providerId: 'MMT_2'
          },
          conceptId: 'ACL1200482477-CMR'
        },
        {
          __typename: 'Acl',
          name: 'Testing 124',
          catalogItemIdentity: {
            __typename: 'CatalogItemIdentity',
            providerId: 'MMT_2'
          },
          conceptId: 'ACL1200482481-CMR'
        },
        {
          __typename: 'Acl',
          name: 'Collection Permission 3',
          catalogItemIdentity: {
            __typename: 'CatalogItemIdentity',
            providerId: 'OPS_ECHO10'
          },
          conceptId: 'ACL1200214092-CMR'
        }
      ]
    }
  }
  const mocks = [{
    request: {
      query: GET_GROUP_ACLS,
      variables: {
        params: { id: '1234-abcd-5678-efgh' },
        aclParams: {
          identityType: 'catalog_item',
          limit: 20,
          offset: 0
        }
      }
    },
    result: {
      data: {
        group: mockGroup
      }
    }
  }]

  const user = userEvent.setup()

  render(
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
                  <Suspense>
                    <AssociatedCollectionPermissionsTable />
                  </Suspense>
                )
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )

  return {
    user
  }
}

describe('AssociatedCollectionPermissionTable', () => {
  describe('when rendering collection permission table', () => {
    test('renders the table ', async () => {
      setup({})

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(6)

      expect(within(table).getAllByRole('columnheader')[0].textContent).toContain('Name')
      expect(within(table).getAllByRole('columnheader')[1].textContent).toContain('Provider Id')

      const row2 = tableRows[2]
      const row2Cells = within(row2).queryAllByRole('cell')
      expect(row2Cells[0].textContent).toBe('Collection Permission 2')
    })
  })

  describe('when the table have 0 results', () => {
    test('should show the No Collection Permission message', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_GROUP_ACLS,
              variables: {
                params: { id: '1234-abcd-5678-efgh' },
                aclParams: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 0
                }
              }
            },
            result: {
              data: {
                group: {
                  __typename: 'Group',
                  id: '1234',
                  acls: {
                    __typename: 'AclList',
                    count: 0,
                    items: []
                  }
                }
              }
            }
          }
        ]
      })

      const table = await screen.findByRole('table')

      const tableRows = within(table).getAllByRole('row')

      expect(tableRows.length).toEqual(2)

      expect(screen.getByText('No associated collection permissions found')).toBeInTheDocument()
    })
  })

  describe('when the table have multiple pages of results', () => {
    test('show the pagination', async () => {
      const { user } = setup({
        overrideMocks: [
          {
            request: {
              query: GET_GROUP_ACLS,
              variables: {
                params: { id: '1234-abcd-5678-efgh' },
                aclParams: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 0
                }
              }
            },
            result: {
              data: {
                group: {
                  __typename: 'Group',
                  id: '1234',
                  acls: {
                    __typename: 'AclList',
                    count: 25,
                    items: [
                      {
                        __typename: 'Acl',
                        name: 'Collection Permission 1',
                        catalogItemIdentity: {
                          __typename: 'CatalogItemIdentity',
                          providerId: 'MMT_2'
                        },
                        conceptId: 'ACL1200214173-CMR'
                      },
                      {
                        __typename: 'Acl',
                        name: 'Collection Permission 2',
                        catalogItemIdentity: {
                          __typename: 'CatalogItemIdentity',
                          providerId: 'MMT_2'
                        },
                        conceptId: 'ACL1200214640-CMR'
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            request: {
              query: GET_GROUP_ACLS,
              variables: {
                params: { id: '1234-abcd-5678-efgh' },
                aclParams: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 20
                }
              }
            },
            result: {
              data: {
                group: {
                  __typename: 'Group',
                  id: '1234',
                  acls: {
                    __typename: 'AclList',
                    count: 25,
                    items: [
                      {
                        __typename: 'Acl',
                        name: 'Collection Permission 1, Page 2',
                        catalogItemIdentity: {
                          __typename: 'CatalogItemIdentity',
                          providerId: 'MMT_2'
                        },
                        conceptId: 'ACL1200214173-CMR'
                      },
                      {
                        __typename: 'Acl',
                        name: 'Collection Permission 2',
                        catalogItemIdentity: {
                          __typename: 'CatalogItemIdentity',
                          providerId: null
                        },
                        conceptId: 'ACL1200214640-CMR'
                      }
                    ]
                  }
                }
              }
            }
          }
        ]
      })

      const paginationContainers = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

      const paginationNavigation = paginationContainers[0]

      const paginationButton = within(paginationNavigation).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      const paginationCells = await screen.findAllByRole('cell')

      expect(paginationCells[0].textContent).toContain('Collection Permission 1, Page 2')
    })
  })
})
