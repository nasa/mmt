import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'
import AppContext from '../../../context/AppContext'
import TemplateList from '../TemplateList'

import errorLogger from '../../../utils/errorLogger'
import getTemplates from '../../../utils/getTemplates'
import deleteTemplate from '../../../utils/deleteTemplate'
import NotificationsContext from '../../../context/NotificationsContext'

vi.mock('../../../utils/deleteTemplate')
vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/getTemplates')

const setup = () => {
  const props = {
    templateType: 'Collection'
  }

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
        <MockedProvider>
          <BrowserRouter initialEntries="">
            <TemplateList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </NotificationsContext.Provider>

    </AppContext.Provider>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('TemplateList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
        await waitForResponse()

        expect(getTemplates).toHaveBeenCalledTimes(1)
        expect(screen.getByText('Showing 2 collection templates'))
      })
    })

    describe('when retrieving templates results in failure', () => {
      test('renders a Error Banner', async () => {
        getTemplates.mockReturnValue({
          error: 'Mock Network Error'
        })

        setup()

        await waitForResponse()

        expect(screen.getByText('Mock Network Error')).toBeInTheDocument()
      })
    })

    describe('when clicking the New Collection Template button', () => {
      test('navigates to the new collection form', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup()
        const button = screen.getByRole('link', { name: 'New Collection Template' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('new', {
          replace: false
        })
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

        await waitForResponse()

        const editLink = screen.getByRole('link', { name: 'Edit' })
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
                  lastModified: '2024-04-03T18:56:54.000Z'
                }
              ]
            }
          )

          deleteTemplate.mockReturnValue({ response: { ok: true } })

          const { user } = setup()

          await waitForResponse()

          const deleteLink = screen.getByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          expect(screen.getByText('Are you sure you want to delete this template?')).toBeInTheDocument()

          const yesButton = screen.getByRole('button', { name: 'Yes' })
          await user.click(yesButton)

          await waitForResponse()
          expect(deleteTemplate).toHaveBeenCalledTimes(1)
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

          await waitForResponse()

          const deleteLink = screen.getByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          const yesButton = screen.getByRole('button', { name: 'Yes' })
          await user.click(yesButton)

          await waitForResponse()

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

          await waitForResponse()

          const deleteLink = screen.getByRole('button', { name: 'Delete' })
          await user.click(deleteLink)

          const noButton = screen.getByRole('button', { name: 'No' })
          await user.click(noButton)

          await waitForResponse()

          expect(deleteTemplate).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})
