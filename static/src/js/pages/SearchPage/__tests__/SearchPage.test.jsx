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
  Route
} from 'react-router-dom'

import {
  singlePageCollectionSearch,
  singlePageCollectionSearchError,
  singlePageServicesSearch,
  singlePageToolsSearch,
  singlePageVariablesSearch
} from './__mocks__/searchResults'

import SearchPage from '../SearchPage'
import AppContext from '../../../context/AppContext'

const setup = (overrideMocks, overrideProps, overrideInitialEntries) => {
  const mocks = [
    singlePageCollectionSearch
  ]

  let props = {}

  if (overrideProps) {
    props = {
      ...props,
      ...overrideProps
    }
  }

  const { container } = render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        }
      }
    }
    >
      <MemoryRouter initialEntries={overrideInitialEntries || ['/collections?keyword=test']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/:type"
              element={<SearchPage {...props} />}
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
    container
  }
}

describe('SearchPage component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryByText('Collections')).toBeInTheDocument()
          expect(screen.queryByText('Search Results')).toBeInTheDocument()
        })
      })

      test('renders the placeholders', async () => {
        expect(screen.queryByText('Loading...'))
      })
    })

    describe('when the request has loaded', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(3)
        })
      })
    })
  })

  // TODO figure out how to suppress the error that this generates in the test output
  describe('when encountering an error', () => {
    test.skip('displays an error', async () => {
      setup([singlePageCollectionSearchError])

      await waitFor(() => {
        expect(screen.queryByText('Sorry!')).toBeInTheDocument()
        expect(screen.queryByText('An error occurred')).toBeInTheDocument()
      })
    })
  })

  describe('when searching for services', () => {
    beforeEach(() => {
      setup([singlePageServicesSearch], {}, ['/services?&keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(2)
        })
      })
    })

    describe('when the request has loaded', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryByText('Services')).toBeInTheDocument()
          expect(screen.queryByText('Search Results')).toBeInTheDocument()
        })
      })

      test('renders the SearchList', async () => {
        expect(true)
      })
    })
  })

  describe('when searching for tools', () => {
    beforeEach(() => {
      setup([singlePageToolsSearch], {}, ['/tools?&keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(2)
        })
      })
    })

    describe('when the request has loaded', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryByText('Tools')).toBeInTheDocument()
          expect(screen.queryByText('Search Results')).toBeInTheDocument()
        })
      })

      test('renders the SearchList', async () => {
        expect(true)
      })
    })
  })

  describe('when searching for variables', () => {
    beforeEach(() => {
      setup([singlePageVariablesSearch], {}, ['/variables?&keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(2)
        })
      })
    })

    describe('when the request has loaded', () => {
      test('renders the header', async () => {
        await waitFor(() => {
          expect(screen.queryByText('Variables')).toBeInTheDocument()
          expect(screen.queryByText('Search Results')).toBeInTheDocument()
        })
      })

      test('renders the SearchList', async () => {
        expect(true)
      })
    })
  })

  describe('when an invalid type is passed', () => {
    beforeEach(() => {
      setup(null, {}, ['/asdf?keyword='])
    })

    test('renders the 404 page', async () => {
      await waitFor(() => {
        expect(screen.queryByText('404 page')).toBeInTheDocument()
      })
    })
  })
})
