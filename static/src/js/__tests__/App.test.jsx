import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { Outlet, useParams } from 'react-router'

import App from '@/js/App'

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')

vi.mock('@/js/pages/SearchPage/SearchPage', () => ({
  default: vi.fn(() => {
    const { type } = useParams()

    return (
      <div data-testid={`mock-${type}-page`}>Search Page</div>
    )
  })
}))

vi.mock('@/js/pages/HomePage/HomePage', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-home-page">Home Page</div>
  ))
}))

vi.mock('@/js/pages/DraftsPage/DraftsPage', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-drafts-page">Drafts Page</div>
  ))
}))

vi.mock('@/js/components/Notifications/Notifications', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-notifications" />
  ))
}))

vi.mock('@/js/providers/Providers/Providers', () => ({
  default: vi.fn(({ children }) => (
    <div data-testid="mock-providers">{children}</div>
  ))
}))

vi.mock('@/js/components/AuthRequiredLayout/AuthRequiredLayout', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-auth-required-container"><Outlet /></div>
  ))
}))

vi.mock('@/js/components/Layout/Layout', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-layout"><Outlet /></div>
  ))
}))

const setup = () => {
  render(
    <App />
  )
}

describe('App component', () => {
  describe('when rendering the "/" route', () => {
    test('renders the notifications', async () => {
      window.history.pushState({}, '', '/')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-notifications')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })

    test('renders the home page', async () => {
      window.history.pushState({}, '', '/')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-home-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/collections" route', () => {
    test('renders the manage collections page', async () => {
      window.history.pushState({}, '', '/collections')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-collections-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/variables" route', () => {
    test('renders the manage variables page', async () => {
      window.history.pushState({}, '', '/variables')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-variables-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/services" route', () => {
    test('renders the manage services page', async () => {
      window.history.pushState({}, '', '/services')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-services-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/tools" route', () => {
    test('renders the manage tools page', async () => {
      window.history.pushState({}, '', '/tools')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-tools-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_collections', () => {
    test('redirects to /manage-collections', () => {
      window.history.pushState({}, '', '/manage_collections')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-collections')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_variables', () => {
    test('redirects to /manage-variables', () => {
      window.history.pushState({}, '', '/manage_variables')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-variables')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_services', () => {
    test('redirects to /manage-services', () => {
      window.history.pushState({}, '', '/manage_services')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-services')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-tools', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage_tools')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-tools')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-cmr', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage-cmr')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/cmr')
      })

      window.history.pushState({}, '', '/')
    })
  })
})
