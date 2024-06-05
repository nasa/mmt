import React from 'react'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import AuthContext from '@/js/context/AuthContext'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import GroupPermissionSelect from '../GroupPermissionSelect'

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = (formData = {}) => {
  const user = userEvent.setup()

  const props = {
    onChange: vi.fn(),
    formData
  }

  render(
    <AuthContext.Provider value={
      {
        token: 'mock-jwt'
      }
    }
    >
      <MockedProvider mocks={
        [{
          request: {
            query: GET_GROUPS,
            variables: { params: { tags: ['MMT_1', 'MMT_2'] } }
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
        }]
      }
      >
        <GroupPermissionSelect {...props} />
      </MockedProvider>
    </AuthContext.Provider>
  )

  return {
    props,
    user
  }
}

describe('GroupPermissionSelect', () => {
  describe('when selecting values for the select', () => {
    test('should select values and call onChange', async () => {
      const { props, user } = setup()
      await waitForResponse()

      const searchField = screen.getByText('Select groups for search')
      await user.click(searchField)

      const option1 = screen.getByRole('option', { name: 'All Guest User' })
      await user.click(option1)

      const searchAndOrderField = screen.getByText('Select groups for search and order')
      await user.click(searchAndOrderField)

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
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          id: '25780f67-91a5-4540-878b-7be541402f29',
          name: 'Group 1',
          tag: 'MMT_2'
        }])
      })

      const { props, user } = setup()
      await waitForResponse()

      const searchField = screen.getByText('Select groups for search')
      await user.click(searchField)

      await user.type(searchField, 'Group 1')

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
      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          id: '25780f67-91a5-4540-878b-7be541402f29',
          name: 'Group 1',
          tag: 'MMT_2'
        }])
      })

      const { props, user } = setup()
      await waitForResponse()

      const searchField = screen.getByText('Select groups for search and order')
      await user.click(searchField)

      await user.type(searchField, 'Group 1')

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
      setup(
        {
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
      )

      await waitForResponse()

      expect(screen.queryByText('All guest user')).toBeInTheDocument()
      expect(screen.queryByText('All registered user')).toBeInTheDocument()
    })
  })
})
