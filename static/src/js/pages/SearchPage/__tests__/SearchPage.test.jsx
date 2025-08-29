import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'

import AppContext from '@/js/context/AppContext'
import userEvent from '@testing-library/user-event'
import {
  singlePageCollectionSearch,
  singlePageCollectionSearchError,
  singlePageServicesSearch,
  singlePageToolsSearch,
  singlePageVariablesSearch
} from './__mocks__/searchResults'
import { providerResults } from './__mocks__/providerResults'

import SearchPage from '../SearchPage'

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: vi.fn()
}))

const setup = ({
  overrideContext = {},
  overrideMocks,
  overrideProps,
  overrideInitialEntries,
  loggedIn = false
} = {}) => {
  const mocks = [
    singlePageCollectionSearch,
    providerResults
  ]

  let defaultUser = {}

  if (loggedIn) {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    defaultUser = {
      name: 'User Name',
      providerId: 'MMT_2',
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires
      }
    }
  }

  const context = {
    user: defaultUser,
    login: vi.fn(),
    logout: vi.fn(),
    setProviderId: vi.fn(),
    ...overrideContext
  }

  let props = {}

  if (overrideProps) {
    props = {
      ...props,
      ...overrideProps
    }
  }

  const user = userEvent.setup()

  render(
    <AppContext.Provider value={context}>
      <MemoryRouter initialEntries={overrideInitialEntries || ['/collections?keyword=test']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/:type"
              element={(
                <SearchPage {...props} />
              )}
            />
            <Route
              path="/404"
              element={<div>404 page</div>}
            />
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    </AppContext.Provider>
  )

  return {
    user
  }
}

describe('SearchPage component', () => {
  describe('when encountering an error', () => {
    test('displays an error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup({
        overrideMocks: [singlePageCollectionSearchError, providerResults]
      })

      expect(await screen.findByText('Sorry!')).toBeInTheDocument()
      expect(await screen.findByText('An error occurred')).toBeInTheDocument()
    })
  })

  describe('when searching for collections', () => {
    beforeEach(() => {
      setup()
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Collections')).toBeInTheDocument()
        expect(await screen.findByText('All Collections')).toBeInTheDocument()
      })
    })
  })

  describe('when searching for services', () => {
    beforeEach(() => {
      setup({
        overrideMocks: [singlePageServicesSearch, providerResults],
        overrideProps: {},
        overrideInitialEntries: ['/services?&keyword=']
      })
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Services')).toBeInTheDocument()
        expect(await screen.findByText('All Services')).toBeInTheDocument()
      })
    })
  })

  describe('when searching for tools', () => {
    beforeEach(() => {
      setup({
        overrideMocks: [singlePageToolsSearch, providerResults],
        overrideProps: {},
        overrideInitialEntries: ['/tools?&keyword=']
      })
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Tools')).toBeInTheDocument()
        expect(await screen.findByText('All Tools')).toBeInTheDocument()
      })
    })
  })

  describe('when searching for variables', () => {
    beforeEach(() => {
      setup({
        overrideMocks: [singlePageVariablesSearch, providerResults],
        overrideProps: {},
        overrideInitialEntries: ['/variables?&keyword=']
      })
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Variables')).toBeInTheDocument()
        expect(await screen.findByText('All Variables')).toBeInTheDocument()
      })
    })
  })

  describe('when an invalid type is passed', () => {
    beforeEach(() => {
      setup({
        overrideMocks: null,
        overrideProps: {},
        overrideInitialEntries: ['/asdf?keyword=']
      })
    })

    test('renders the 404 page', async () => {
      expect(await screen.findByText('404 page')).toBeInTheDocument()
    })
  })

  describe('when performing a search', () => {
    let user
    const navigateMock = vi.fn()

    beforeEach(() => {
      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + 15)
      expires = new Date(expires)

      useNavigate.mockReturnValue(navigateMock)

      const { user: userFromSetup } = setup({
        overrideMocks: [singlePageServicesSearch, providerResults],
        overrideContext: {
          user: {
            name: 'User Name',
            token: {
              tokenValue: 'ABC-1',
              tokenExp: expires.valueOf()
            },
            providerId: 'MMT_2'
          },
          login: vi.fn(),
          logout: vi.fn()
        },
        overrideInitialEntries: ['/services?&keyword=']
      })

      user = userFromSetup
    })

    describe('when the user types a query', () => {
      test('updates the input', async () => {
        const searchInput = await screen.findByRole('textbox', { name: 'Search' })

        await user.type(searchInput, 'search query')

        expect(searchInput).toHaveValue('search query')
      })
    })

    describe('when the user submits search query using the input', () => {
      test('updates the input', async () => {
        const searchInput = await screen.findByRole('textbox', { name: 'Search' })
        const searchSubmitButton = screen.getByRole('button', { name: 'Search' })

        await user.type(searchInput, 'search query')

        expect(searchInput).toHaveValue('search query')

        await user.click(searchSubmitButton)

        expect(navigateMock).toHaveBeenCalledTimes(1)
        expect(navigateMock).toHaveBeenCalledWith('/services?keyword=search+query')
      })
    })

    describe('when submitting the search with a provider set', () => {
      test('sets the provider', async () => {
        const searchOptionsButton = screen.queryByRole('button', { name: 'Search Options' })

        await user.click(searchOptionsButton)

        const providerDropdown = screen.getByRole('combobox')

        await userEvent.selectOptions(providerDropdown, ['TESTPROV2'])

        const option = await screen.findByRole('option', { name: 'TESTPROV2' })

        expect(option.selected).toBe(true)

        const button = screen.queryByRole('button', { name: 'Search' })

        await user.click(button)

        await waitFor(() => {
          expect(navigateMock).toHaveBeenCalledTimes(1)
        })

        expect(navigateMock).toHaveBeenCalledWith('/services?keyword=&provider=TESTPROV2')
      })
    })
  })
})
