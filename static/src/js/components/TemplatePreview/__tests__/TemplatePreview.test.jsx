import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { Cookies, CookiesProvider } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import Providers from '../../../providers/Providers/Providers'
import TemplatePreview from '../TemplatePreview'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'

import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import getTemplate from '../../../utils/getTemplate'

vi.mock('../../../utils/getTemplate')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../PreviewProgress/PreviewProgress')

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
          TemplateName: 'Mock Template',
          ShortName: 'Template Form Test',
          Version: '1.0.0'
        }
      })

      setup()
      await waitForResponse()

      expect(PreviewProgress).toHaveBeenCalledTimes(2)
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
})
