import React from 'react'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import {
  GET_GROUPS_FOR_PERMISSION_SELECT
} from '@/js/operations/queries/getGroupsForPermissionSelect'
import GroupPermissionSelect from '../GroupPermissionSelect'

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = ({
  additionalMocks = [],
  formData = {}
}) => {
  const user = userEvent.setup()

  const props = {
    onChange: vi.fn(),
    formData
  }

  render(
    <MockedProvider mocks={
      [{
        request: {
          query: GET_GROUPS,
          variables: {
            params: {
              tags: ['MMT_1', 'MMT_2'],
              limit: 500
            }
          }
        },
        result: {
          data: {
            groups: {
              __typename: 'GroupList',
              count: 2,
              items: [
                {
                  __typename: 'Group',
                  description: 'This is a mock group 1',
                  id: '25780f67-91a5-4540-878b-7be541402f29',
                  members: {
                    __typename: 'GroupMemberList',
                    count: 2
                  },
                  name: 'Group 1',
                  tag: 'MMT_2'
                },
                {
                  __typename: 'Group',
                  description: 'This is a mock group 2',
                  id: 'd3d81f54-f3b8-4557-bfc4-f84a25fe0f75',
                  members: {
                    __typename: 'GroupMemberList',
                    count: 3
                  },
                  name: 'Group 2',
                  tag: 'CMR'
                }

              ]

            }
          }
        }
      }, ...additionalMocks]
    }
    >
      <GroupPermissionSelect {...props} />
    </MockedProvider>
  )

  return {
    props,
    user
  }
}

describe('GroupPermissionSelect', () => {
  describe('when selecting values for the select', () => {
    test('should select values and call onChange', async () => {
      const { props, user } = setup({})

      const searchField = await screen.findAllByRole('combobox')
      await user.click(searchField[0])

      const option1 = screen.getByRole('option', { name: 'All Guest User' })
      await user.click(option1)

      const searchAndOrderField = await screen.findAllByRole('combobox')
      await user.click(searchAndOrderField[1])

      const option2 = screen.getByRole('option', { name: 'All Registered Users' })

      await user.click(option2)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith(
        {
          searchGroup: [
            {
              isDisabled: false,
              label: 'All Guest User',
              value: 'all-guest-user'
            }
          ]
        }
      )
    })
  })

  describe('when searching for groups', () => {
    test('should call groups with and returns filtered data', async () => {
      const { props, user } = setup({
        additionalMocks: [
          {
            request: {
              query: GET_GROUPS_FOR_PERMISSION_SELECT,
              variables: {
                params: {
                  name: 'Gro',
                  limit: 20,
                  tags: ['MMT_1,MMT_2', 'CMR']
                }
              }
            },
            result: {
              data: {
                groups: {
                  items: [
                    {
                      id: '25780f67-91a5-4540-878b-7be541402f29',
                      name: 'Group 1',
                      tag: 'MMT_2',
                      __typename: 'Group'
                    }

                  ],
                  __typename: 'CollectionList'
                }
              }
            }
          }
        ]
      })

      const searchField = await screen.findAllByRole('combobox')

      await user.click(searchField[0])

      await user.type(searchField[0], 'Gro')

      const option1 = screen.getByRole('option', { name: 'Group 1 MMT_2' })
      await user.click(option1)
      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(
        {
          searchGroup: [
            {
              isDisabled: false,
              label: 'Group 1',
              value: 'Group 1',
              provider: 'MMT_2'
            }
          ]
        }
      )
    })
  })

  describe('when searching for search and order field', () => {
    test('should call groups with and returns filtered data', async () => {
      const { props, user } = setup({
        additionalMocks: [
          {
            request: {
              query: GET_GROUPS_FOR_PERMISSION_SELECT,
              variables: {
                params: {
                  name: 'Gro',
                  limit: 20,
                  tags: ['MMT_1,MMT_2', 'CMR']
                }
              }
            },
            result: {
              data: {
                groups: {
                  items: [
                    {
                      id: '25780f67-91a5-4540-878b-7be541402f29',
                      name: 'Group 1',
                      tag: 'MMT_2',
                      __typename: 'Group'
                    }

                  ],
                  __typename: 'CollectionList'
                }
              }
            }
          }
        ]
      })

      const searchField = await screen.findAllByRole('combobox')
      await user.click(searchField[1])

      await user.type(searchField[1], 'Gro')

      const option1 = screen.getByRole('option', { name: 'Group 1 MMT_2' })
      await user.click(option1)
      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(
        {
          searchAndOrderGroup: [
            {
              isDisabled: false,
              label: 'Group 1',
              value: 'Group 1',
              provider: 'MMT_2'
            }
          ]
        }
      )
    })
  })

  describe('when formData has saved groups', () => {
    test('renders saved groups', async () => {
      setup({
        formData: {
          searchGroup: [
            {
              value: 'all-guest-user',
              label: 'All guest user',
              isDisabled: true
            }
          ],
          searchAndOrderGroup: [
            {
              value: 'all-registered-user',
              label: 'All registered user',
              isDisabled: true
            }
          ]
        }
      })

      expect(await screen.findByText('All guest user')).toBeInTheDocument()
      expect(screen.getByText('All registered user')).toBeInTheDocument()
    })
  })
})
