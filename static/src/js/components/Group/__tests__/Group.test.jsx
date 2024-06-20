import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { GET_GROUP } from '@/js/operations/queries/getGroup'

import Group from '../Group'

vi.mock('../../AssociatedCollectionPermissionsTable/AssociatedCollectionPermissionsTable')

const setup = ({
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
                    <Group />
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

describe('GroupPreview', () => {
  describe('when getting group results in a success', () => {
    test('renders the group', async () => {
      setup({})

      expect(await screen.findByText('Mock group description')).toBeInTheDocument()

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('test.user')).toBeInTheDocument()
    })
  })
})
