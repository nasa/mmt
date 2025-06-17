import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import { GET_PROVIDERS } from '@/js/operations/queries/getProviders'
import GroupSearchForm from '../GroupSearchForm'

import Providers from '../../../providers/Providers/Providers'

const setup = (initialPath = '/groups') => {
  const mocks = [{
    request: {
      query: GET_PROVIDERS
    },
    result: {
      data: {
        providers: {
          count: 2,
          items: [
            {
              providerId: 'MMT_1',
              shortName: 'MMT_1',
              __typename: 'Provider'
            },
            {
              providerId: 'MMT_2',
              shortName: 'MMT_2',
              __typename: 'Provider'
            }
          ],
          __typename: 'ProviderList'
        }
      }
    }
  }]

  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider
        mocks={mocks}
      >
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route
              path="/groups"
              element={
                (
                  <Suspense>
                    <GroupSearchForm />
                  </Suspense>
                )
              }
            />
            <Route
              path="/admin/groups"
              element={
                (
                  <Suspense>
                    <GroupSearchForm isAdminPage />
                  </Suspense>
                )
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user
  }
}

describe('GroupSearchForm', () => {
  describe('when searching by group name', () => {
    test('updates the URL with the value', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup()

      const nameField = await screen.findByRole('textbox', { name: 'Name' })

      await user.type(nameField, 'Test Name')

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/groups?name=Test+Name')
    })
  })

  describe('when searching by provider', () => {
    test('updates the URL with the value', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup()

      const comboboxes = await screen.findAllByRole('combobox')
      const providerField = comboboxes[0]

      await user.click(providerField)
      const option = screen.getByRole('option', { name: 'MMT_1' })
      await user.click(option)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/groups?providers=MMT_1')
    })
  })

  describe('when searching by user', () => {
    test('updates the URL with the value', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          id: 'testuser1',
          label: 'Test User 1'
        }, {
          id: 'testuser2',
          label: 'Test User 2'
        }])
      })

      const { user } = setup()

      const comboboxes = await screen.findAllByRole('combobox')
      const membersField = comboboxes[1]

      await user.click(membersField)
      await user.type(membersField, 'test')
      const option1 = screen.getByRole('option', { name: 'Test User 1 testuser1' })
      await user.click(option1)

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)

      const encodedUsers = Buffer.from(JSON.stringify([{
        label: 'Test User 1',
        id: 'testuser1'
      }])).toString('base64')
      expect(navigateSpy).toHaveBeenCalledWith(`/groups?members=${encodedUsers}`)
    })
  })

  describe('when loading the page', () => {
    test.only('populates the form fields', async () => {
      const encodedUsers = Buffer.from(JSON.stringify([{
        id: 'testuser1',
        label: 'Test User 1'
      }])).toString('base64')

      setup(`/groups?name=Test+Name&providers=MMT_1&members=${encodedUsers}`)

      const nameField = await screen.findByRole('textbox', { name: 'Name' })
      expect(nameField).toHaveValue('Test Name')

      expect(screen.getByText('MMT_1').className).toContain('css-9jq23d')

      // The CustomAsyncMultiSelectWidget doesn't use the same classes as MultiSelect
      expect(screen.getByText('Test User 1').className).not.toContain('css-9jq23d')
    })
  })

  describe('when searching for system groups', () => {
    test('updates the URL with the value', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup('/admin/groups')

      const nameField = await screen.findByRole('textbox', { name: 'Name' })

      await user.type(nameField, 'Test Name')

      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/admin/groups?name=Test+Name')
    })
  })
})
