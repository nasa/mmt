import React from 'react'
import { render, screen } from '@testing-library/react'
import { Outlet, useParams } from 'react-router'

import App from '@/js/App'

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/utils/errorLogger')

vi.mock('@/js/hooks/useAuthContext', () => ({
  default: vi.fn(() => ({
    user: {
      uid: 'testuser'
    }
  }))
}))

vi.mock('@/js/hooks/usePermissions', () => ({
  default: vi.fn(() => ({
    hasSystemGroup: true,
    hasSystemKeywords: true,
    loading: false
  }))
}))

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

vi.mock('@/js/components/LayoutUnauthenticated/LayoutUnauthenticated', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-layout-unauthenticated"><Outlet /></div>
  ))
}))

vi.mock('@/js/pages/KeywordManagerPage/KeywordManagerPage', () => ({
  default: vi.fn(({ isAdminPage }) => (
    <div data-testid={`mock-keyword-manager-page${isAdminPage ? '-admin' : ''}`}>Keyword Manager Page</div>
  ))
}))

vi.mock('@/js/pages/GranulesListPage/GranulesListPage', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-granules-list-page">Granules List Page</div>
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

      expect(await screen.findByTestId('mock-notifications')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })

    test('renders the home page', async () => {
      window.history.pushState({}, '', '/')

      setup()

      expect(await screen.findByTestId('mock-home-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/collections" route', () => {
    test('renders the manage collections page', async () => {
      window.history.pushState({}, '', '/collections')

      setup()

      expect(await screen.findByTestId('mock-collections-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/variables" route', () => {
    test('renders the manage variables page', async () => {
      window.history.pushState({}, '', '/variables')

      setup()

      expect(await screen.findByTestId('mock-variables-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/services" route', () => {
    test('renders the manage services page', async () => {
      window.history.pushState({}, '', '/services')

      setup()

      expect(await screen.findByTestId('mock-services-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/tools" route', () => {
    test('renders the manage tools page', async () => {
      window.history.pushState({}, '', '/tools')

      setup()

      expect(await screen.findByTestId('mock-tools-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_collections', () => {
    test('redirects to /collections', () => {
      window.history.pushState({}, '', '/manage_collections')

      setup()

      expect(window.location.href).toEqual('http://localhost:3000/collections')

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_variables', () => {
    test('redirects to /variables', () => {
      window.history.pushState({}, '', '/manage_variables')

      setup()

      expect(window.location.href).toEqual('http://localhost:3000/variables')

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_services', () => {
    test('redirects to /services', () => {
      window.history.pushState({}, '', '/manage_services')

      setup()

      expect(window.location.href).toEqual('http://localhost:3000/services')

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_tools', () => {
    test('redirects to /tools', () => {
      window.history.pushState({}, '', '/manage_tools')

      setup()

      expect(window.location.href).toEqual('http://localhost:3000/tools')

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_cmr', () => {
    test('redirects to /collections', () => {
      window.history.pushState({}, '', '/manage_cmr')

      setup()

      expect(window.location.href).toEqual('http://localhost:3000/collections')

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/admin/keywordmanager" route', () => {
    test('renders the admin keyword manager page', async () => {
      window.history.pushState({}, '', '/admin/keywordmanager')

      setup()

      expect(await screen.findByTestId('mock-keyword-manager-page-admin')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/collections/:conceptId/granules" route', () => {
    test('renders the granules list page', async () => {
      const mockConceptId = 'C1234567-TEST'
      window.history.pushState({}, '', `/collections/${mockConceptId}/granules`)

      setup()

      expect(await screen.findByTestId('mock-granules-list-page')).toBeInTheDocument()

      window.history.pushState({}, '', '/')
    })
  })
})
