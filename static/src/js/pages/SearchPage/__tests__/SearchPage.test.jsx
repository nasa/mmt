import React from 'react'
import { render, screen } from '@testing-library/react'
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

  render(
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
  )
}

describe('SearchPage component', () => {
  describe('when encountering an error', () => {
    test('displays an error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup([singlePageCollectionSearchError])

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
        expect(await screen.findByText('Search Results')).toBeInTheDocument()
      })

      test.skip('renders the SearchList', () => {
        expect(true)
      })
    })
  })

  describe('when searching for services', () => {
    beforeEach(() => {
      setup([singlePageServicesSearch], {}, ['/services?&keyword='])
    })

    describe('while the request is loading', () => {
      test('renders the header', async () => {
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Services')).toBeInTheDocument()
        expect(await screen.findByText('Search Results')).toBeInTheDocument()
      })

      test.skip('renders the SearchList', () => {
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
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Tools')).toBeInTheDocument()
        expect(await screen.findByText('Search Results')).toBeInTheDocument()
      })

      test.skip('renders the SearchList', () => {
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
        expect(screen.getAllByRole('row').length).toEqual(10)

        expect(await screen.findByText('Variables')).toBeInTheDocument()
        expect(await screen.findByText('Search Results')).toBeInTheDocument()
      })

      test.skip('renders the SearchList', () => {
        expect(true)
      })
    })
  })

  describe('when an invalid type is passed', () => {
    beforeEach(() => {
      setup(null, {}, ['/asdf?keyword='])
    })

    test('renders the 404 page', async () => {
      expect(await screen.findByText('404 page')).toBeInTheDocument()
    })
  })
})
