import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'

import errorLogger from '@/js/utils/errorLogger'
import getTemplates from '@/js/utils/getTemplates'
import deleteTemplate from '@/js/utils/deleteTemplate'
import NotificationsContext from '@/js/context/NotificationsContext'
import MMT_COOKIE from '@/js/constants/mmtCookie'

import { getApplicationConfig } from '../../../../../../sharedUtils/getConfig'

import TemplateList from '../TemplateList'

const { env } = getApplicationConfig()

vi.mock('@/js/utils/deleteTemplate')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/getTemplates')

vi.mock('react-cookie', async () => ({
  ...await vi.importActual('react-cookie'),
  useCookies: vi.fn().mockImplementation(() => ([
    {
      [`${MMT_COOKIE}_${env}`]: 'mock-jwt'
    },
    vi.fn(),
    vi.fn()
  ]))
}))

const setup = () => {
  const props = {
    templateType: 'Collection'
  }

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MockedProvider>
        <BrowserRouter initialEntries="">
          <TemplateList {...props} />
        </BrowserRouter>
      </MockedProvider>
    </NotificationsContext.Provider>
  )

  return {
    props,
    user
  }
}

describe('TemplateList', () => {
  describe('when template type Collection is given ', () => {
    describe('when retrieving templates results in success', () => {
      test('renders Collection Template List', async () => {
        getTemplates.mockReturnValue(
          {
            response: [
              {
                id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                name: 'Mock Template 1',
                lastModified: '2024-04-03T18:56:54.000Z'
              },
              {
                id: '2a68ebf9-b65e-47f7-91a1-c0690378d905',
                name: 'Mock Template 2',
                lastModified: '2024-04-03T18:57:34.000Z'
              }
            ]
          }
        )

        setup()

        expect(await screen.findByText('Showing 2 collection templates'))
        expect(getTemplates).toHaveBeenCalledTimes(1)
      })
    })

    describe('when retrieving templates results in failure', () => {
      test('renders a Error Banner', async () => {
        getTemplates.mockReturnValue({
          error: 'Mock Network Error'
        })

        setup()

        expect(await screen.findByText('Mock Network Error')).toBeInTheDocument()
      })
    })

    describe('when clicking the New Collection Template button', () => {
      test('navigates to the new collection form', async () => {
        const navigateSpy = vi.fn()
        getTemplates.mockReturnValue(
          {
            response: [
              {
                id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                lastModified: '2024-04-03T18:56:54.000Z'
              }
            ]
          }
        )

        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup()

        const button = screen.getByRole('button', { name: /New Template/ })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('new', { replace: false })
      })
    })

    describe('when clicking the Edit button', () => {
      test('navigates to the collection template preview page', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        getTemplates.mockReturnValue(
          {
            response: [
              {
                id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                lastModified: '2024-04-03T18:56:54.000Z'
              }
            ]
          }
        )

        const { user } = setup()

        const editLink = await screen.findByRole('link', { name: 'Edit' })
        await user.click(editLink)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections/c23b6d55-b1de-4843-b828-32de2a0bd109/collection-information', {
          replace: false
        })
      })
    })

    describe('when clicking the delete button', () => {
      describe('when clicking Yes on the delete modal results in a success', () => {
        test('deletes and hide the model', async () => {
          getTemplates.mockReturnValue(
            {
              response: [
                {
                  id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                  providerId: 'MMT_1',
                  lastModified: '2024-04-03T18:56:54.000Z'
                }
              ]
            }
          )

          deleteTemplate.mockReturnValue({ response: { ok: true } })

          const { user } = setup()

          const deleteLink = await screen.findByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          expect(screen.getByText('Are you sure you want to delete this template?')).toBeInTheDocument()

          const yesButton = screen.getByRole('button', { name: 'Yes' })
          await user.click(yesButton)

          expect(deleteTemplate).toHaveBeenCalledTimes(1)
          expect(deleteTemplate).toHaveBeenCalledWith('MMT_1', 'mock-jwt', 'c23b6d55-b1de-4843-b828-32de2a0bd109')
        })
      })

      describe('when clicking Yes on the delete modal results in a failure', () => {
        test('calls addNotification and errorLogger', async () => {
          getTemplates.mockReturnValue(
            {
              response: [
                {
                  id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                  lastModified: '2024-04-03T18:56:54.000Z'
                }
              ]
            }
          )

          deleteTemplate.mockReturnValue({ response: { ok: false } })

          const { user } = setup()

          const deleteLink = await screen.findByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          const yesButton = screen.getByRole('button', { name: 'Yes' })
          await user.click(yesButton)

          expect(errorLogger).toHaveBeenCalledTimes(1)
          expect(errorLogger).toHaveBeenCalledWith('Error deleting template', 'TemplateList: deleteTemplate')
        })
      })

      describe('when clicking No on the delete modal', () => {
        test('calls the deleteModal and clicks no', async () => {
          getTemplates.mockReturnValue(
            {
              response: [
                {
                  id: 'c23b6d55-b1de-4843-b828-32de2a0bd109',
                  lastModified: '2024-04-03T18:56:54.000Z'
                }
              ]
            }
          )

          const { user } = setup()

          const deleteLink = await screen.findByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          const noButton = screen.getByRole('button', { name: 'No' })
          await user.click(noButton)

          expect(deleteTemplate).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})
