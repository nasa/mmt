import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { ApolloClient } from '@apollo/client'

import App from '../App'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(() => ({ mockCache: {} })),
  ApolloProvider: jest.fn(({ children }) => children)
}))

jest.mock('../pages/ManageCollectionsPage/ManageCollectionsPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-collections-page">Manage Collections Page</div>
  ))
}))

jest.mock('../pages/ManageVariablesPage/ManageVariablesPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-variables-page">Manage Variables Page</div>
  ))
}))

jest.mock('../pages/ManageServicesPage/ManageServicesPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-services-page">Manage Services Page</div>
  ))
}))

jest.mock('../pages/ManageToolsPage/ManageToolsPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-tools-page">Manage Tools Page</div>
  ))
}))

jest.mock('../pages/ManageCmrPage/ManageCmrPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-cmr-page">Manage CMR Page</div>
  ))
}))

describe('App component', () => {
  test('initializes Apollo with the correct options', async () => {
    render(<App />)

    expect(ApolloClient).toHaveBeenCalledTimes(1)
    expect(ApolloClient).toHaveBeenCalledWith({
      cache: { mockCache: {} },
      uri: 'http://localhost:3013/dev/api'
    })
  })

  describe('when rendering the default route', () => {
    test('renders the manage variables page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-collections-page')).toBeInTheDocument()
    })
  })

  describe('when rendering the manage collection route', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage-collections')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('renders the manage variables page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-collections-page')).toBeInTheDocument()
    })
  })

  describe('when rendering the manage variables route', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage-variables')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('renders the manage variables page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-variables-page')).toBeInTheDocument()
    })
  })

  describe('when rendering the manage services route', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage-services')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('renders the manage services page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-services-page')).toBeInTheDocument()
    })
  })

  describe('when rendering the manage tools route', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage-tools')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('renders the manage tools page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-tools-page')).toBeInTheDocument()
    })
  })

  describe('when rendering the manage CMR route', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage-cmr')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('renders the manage CMR page', async () => {
      render(<App />)
      expect(screen.getByTestId('mock-manage-cmr-page')).toBeInTheDocument()
    })
  })

  describe('when visiting /', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-collections', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-collections')
      })
    })
  })

  describe('when visiting /manage_collections', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage_collections')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-collections', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-collections')
      })
    })
  })

  describe('when visiting /manage_variable', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage_variable')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-variable', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-variable')
      })
    })
  })

  describe('when visiting /manage_services', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage_services')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-services', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-services')
      })
    })
  })

  describe('when visiting /manage_tools', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage_tools')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-tools', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-tools')
      })
    })
  })

  describe('when visiting /manage_cmr', () => {
    beforeEach(() => {
      delete window.location
      window.location = new URL('http://localhost/manage_cmr')
    })

    afterEach(() => {
      delete window.location
      window.location = new URL('http://localhost/')
    })

    test('redirects to /manage-cmr', () => {
      render(<App />)

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-cmr')
      })
    })
  })
})
