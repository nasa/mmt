import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'

import userEvent from '@testing-library/user-event'
import PrimaryNavigationGroup from '../PrimaryNavigationGroup'
import PrimaryNavigationLink from '../../PrimaryNavigationLink/PrimaryNavigationLink'

vi.mock('../../PrimaryNavigationLink/PrimaryNavigationLink', () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="mock-primary-navigation-link">Mock Link</div>
  ))
}))

const setup = ({
  overrideInitialEntries,
  overrideProps = {}
} = {}) => {
  const conditionalRouterProps = {}

  if (overrideInitialEntries) conditionalRouterProps.initialEntries = [...overrideInitialEntries]

  const user = userEvent.setup()

  render(
    <MemoryRouter {...conditionalRouterProps}>
      <Routes>
        <Route
          path="/"
          element={
            (
              <PrimaryNavigationGroup
                childItems={
                  [
                    {
                      title: 'Link 1',
                      to: '/link-1'
                    },
                    {
                      title: 'Link 2',
                      to: '/link-2'
                    }
                  ]
                }
                title="Collections"
                {...overrideProps}
              />
            )
          }
        />
        <Route
          path="/link-1"
          element={
            (
              <PrimaryNavigationGroup
                childItems={
                  [
                    {
                      title: 'Link 1',
                      to: '/link-1'
                    },
                    {
                      title: 'Link 2',
                      to: '/link-2'
                    }
                  ]
                }
                title="Collections"
                {...overrideProps}
              />
            )
          }
        />
      </Routes>
    </MemoryRouter>
  )

  return {
    user
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('PrimaryNavigationGroup', () => {
  test('renders a link inside a list item', () => {
    setup()

    const listitem = screen.getByRole('listitem')

    expect(listitem).toBeInTheDocument()
  })

  test('renders the children links', () => {
    setup()

    expect(PrimaryNavigationLink).toHaveBeenCalledTimes(2)
    expect(PrimaryNavigationLink).toHaveBeenNthCalledWith(
      1,
      {
        tabIndex: '-1',
        title: 'Link 1',
        to: '/link-1',
        visible: undefined
      },
      {}
    )

    expect(PrimaryNavigationLink).toHaveBeenNthCalledWith(
      2,
      {
        tabIndex: '-1',
        title: 'Link 2',
        to: '/link-2',
        visible: undefined
      },
      {}
    )
  })

  test('renders the menu closed', () => {
    setup()

    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })

  describe('when the current page is displayed', () => {
    test('renders the menu open', () => {
      setup({
        overrideInitialEntries: ['/link-1']
      })

      expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
    })
  })

  describe('when the menu is open', () => {
    test('sets the tab index of the links to 0', () => {
      setup({
        overrideInitialEntries: ['/link-1']
      })

      expect(PrimaryNavigationLink).toHaveBeenCalledTimes(4)
      expect(PrimaryNavigationLink).toHaveBeenNthCalledWith(
        3,
        {
          tabIndex: '0',
          title: 'Link 1',
          to: '/link-1',
          visible: undefined
        },
        {}
      )

      expect(PrimaryNavigationLink).toHaveBeenNthCalledWith(
        4,
        {
          tabIndex: '0',
          title: 'Link 2',
          to: '/link-2',
          visible: undefined
        },
        {}
      )
    })
  })

  describe('when clicking the list item', () => {
    test('opens the menu', async () => {
      const { user } = setup()

      const listitem = screen.getByLabelText('Open menu')

      expect(listitem).toBeInTheDocument()

      await user.click(listitem)

      expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
    })
  })

  describe('when the menu is open', () => {
    describe('when clicking the list item', () => {
      test('opens the menu', async () => {
        const { user } = setup({
          overrideInitialEntries: ['/link-1']
        })

        const listitem = screen.getByLabelText('Close menu')

        expect(listitem).toBeInTheDocument()

        await user.click(listitem)

        expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
      })
    })
  })

  describe('when visible is set to false', () => {
    test('does not render the list item', async () => {
      setup({
        overrideProps: {
          visible: false
        }
      })

      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })

  describe('when visible is undefined', () => {
    test('renders the list item', async () => {
      setup({
        overrideProps: {
          visible: undefined
        }
      })

      expect(screen.getByRole('listitem')).toBeInTheDocument()
    })
  })

  describe('when a version is defined', () => {
    test('renders the version', async () => {
      setup({
        overrideProps: {
          version: 'v1'
        }
      })

      expect(screen.getByText('v1')).toBeInTheDocument()
    })
  })
})
