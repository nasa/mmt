import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { Cookies, CookiesProvider } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { beforeEach } from 'vitest'
import Providers from '../../../providers/Providers/Providers'
import TemplatePreview from '../TemplatePreview'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'

import deleteTemplate from '../../../utils/deleteTemplate'
import errorLogger from '../../../utils/errorLogger'
import getTemplate from '../../../utils/getTemplate'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'

vi.mock('../../../utils/getTemplate')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../PreviewProgress/PreviewProgress')
vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/deleteTemplate')

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

const setup = () => {
  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <Providers>
        <MockedProvider>
          <MemoryRouter initialEntries={['/templates/collections/1234-abcd-5678-efgh']}>
            <Routes>
              <Route
                element={<TemplatePreview />}
                path="templates/:templateType/:id"
              />
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

describe('TemplatePreview', () => {
  describe('when showing template preview', () => {
    test('render a template preview', async () => {
      getTemplate.mockReturnValue({
        response: {
          template: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          providerId: 'MMT-1'
        }
      })

      setup()
      await waitForResponse()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when showing template preview results in an error', () => {
    test('render a template preview', async () => {
      getTemplate.mockReturnValue({
        error: 'An error occurred'
      })

      setup()
      await waitForResponse()

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('showing the breadcrumbs', () => {
    test('renders the breadcrumbs', async () => {
      getTemplate.mockReturnValue({
        response: {}
      })

      setup()

      await waitForResponse()

      const breadcrumbs = screen.getByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbOne = within(breadcrumbs).getByText('Collection Templates')
      const breadcrumbTwo = within(breadcrumbs).getByText('<Blank Name>')

      expect(breadcrumbOne.href).toEqual('http://localhost:3000/templates/collections')
      expect(breadcrumbTwo).toHaveClass('active')
    })
  })

  describe('when clicking on  delete button', () => {
    describe('when clicking on Yes on the delete ', () => {
      test('should delete the template and navigate', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        deleteTemplate.mockReturnValue({ response: { ok: true } })

        const { user } = setup()
        await waitForResponse()

        const deleteButton = screen.getByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        expect(screen.getByText('Are you sure you want to delete this template?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()
        expect(deleteTemplate).toHaveBeenCalledTimes(1)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections')
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('calls addNotification and errorLogger', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        deleteTemplate.mockReturnValue({ response: { ok: false } })

        const { user } = setup()

        await waitForResponse()

        const deleteButton = screen.getByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error deleting template', 'TemplatePreview: deleteTemplate')
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('calls the deleteModal and clicks no', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        const { user } = setup()

        await waitForResponse()

        const deleteButton = screen.getByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        await waitForResponse()

        expect(deleteTemplate).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('Create Collection Draft button', () => {
    const mutationSetup = ({ mocks }) => {
      render(
        <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
          <Providers>
            <MockedProvider mocks={mocks}>
              <MemoryRouter initialEntries={['/templates/collections/1234-abcd-5678-efgh']}>
                <Routes>
                  <Route
                    element={<TemplatePreview />}
                    path="templates/:templateType/:id"
                  />
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

    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: () => 'mock-uuid'
      }
    })

    beforeEach(() => {
      getTemplate.mockReturnValue({
        response: {
          template: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          providerId: 'MMT_2'
        }
      })
    })

    describe('when clicking on create button results in a success', () => {
      test('should ingest a collectionDraft and navigate to collection draft', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = mutationSetup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: {
                  ShortName: 'Template Form Test',
                  Version: '1.0.0'
                },
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: '1.17.3'
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'CD1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        await waitForResponse()

        const createButton = screen.getByRole('button', { name: /Create Draft/ })
        await user.click(createButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/CD1000000-MMT')
      })
    })

    describe('when clicking on create button results in a failure', () => {
      test('calls errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = mutationSetup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: {
                  ShortName: 'Template Form Test',
                  Version: '1.0.0'
                },
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: '1.17.3'
              }
            },
            error: new Error('An error occurred')
          }]
        })

        await waitForResponse()

        const createButton = screen.getByRole('button', { name: /Create Draft/ })
        await user.click(createButton)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Template Preview: ingestDraft Mutation')
      })
    })
  })
})
