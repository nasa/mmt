import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import MockPrimaryNavigation from '../../PrimaryNavigation/PrimaryNavigation'

import Page from '../Page'

vi.mock('../../PrimaryNavigation/PrimaryNavigation', () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="mock-primary-navigation" />
  ))
}))

describe('Page component', () => {
  test('renders the primary navigation with the correct items', async () => {
    render(
      <Page title="Test page">
        This is some page content
      </Page>
    )

    expect(screen.getByTestId('mock-primary-navigation')).toBeInTheDocument()
    expect(MockPrimaryNavigation.mock.calls[0][0].items).toEqual([
      {
        to: '/collections',
        title: 'Collections',
        version: 'v1.17.3',
        children: [
          {
            to: '/drafts/collections',
            title: 'Drafts'
          },
          {
            to: '/templates/collections',
            title: 'Templates'
          }
        ]
      },
      {
        to: '/variables',
        title: 'Variables',
        version: 'v1.9.0',
        children: [
          {
            to: '/drafts/variables',
            title: 'Drafts'
          }
        ]
      },
      {
        to: '/services',
        title: 'Services',
        version: 'v1.5.2',
        children: [
          {
            to: '/drafts/services',
            title: 'Drafts'
          }
        ]
      },
      {
        to: '/tools',
        title: 'Tools',
        version: 'v1.2.0',
        children: [
          {
            to: '/drafts/tools',
            title: 'Drafts'
          }
        ]
      },
      {
        to: '/order-options',
        title: 'Order Options'
      }
    ])
  })

  test('renders the title visually hidden', () => {
    render(
      <Page title="Test page">
        This is some page content
      </Page>
    )

    expect(screen.getByText('Test page')).toBeInTheDocument()
    expect(screen.getByText('Test page').parentElement.parentElement).toHaveClass('sr-only')
  })

  test('renders the content', () => {
    render(
      <Page title="Test page">
        This is some page content
      </Page>
    )

    expect(screen.getByText('This is some page content')).toBeInTheDocument()
  })

  describe('when primaryActions are defined', () => {
    test('displays the action', async () => {
      render(
        <BrowserRouter>
          <Page
            title="Test page"
            primaryActions={
              [
                {
                  title: 'Test Action',
                  to: '/test-action',
                  variant: 'primary'
                }
              ]
            }
          >
            This is some page content
          </Page>
        </BrowserRouter>
      )

      const actionButton = screen.getByText('Test Action')

      expect(actionButton).toBeInTheDocument()
    })

    describe('when clicking an items with a "to" defined', () => {
      test('navigates to the correct location', async () => {
        const user = userEvent.setup()
        render(
          <BrowserRouter>
            <Page
              title="Test page"
              primaryActions={
                [
                  {
                    title: 'Test Action',
                    to: '/test-action',
                    variant: 'primary'
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        const actionButton = screen.getByText('Test Action')

        await user.click(actionButton)

        expect(window.location.pathname).toEqual('/test-action')
      })
    })

    describe('when clicking an items with a "onClick" defined', () => {
      test('fires the callback function', async () => {
        const user = userEvent.setup()
        const mockOnClick = vi.fn()

        render(
          <BrowserRouter>
            <Page
              title="Test page"
              primaryActions={
                [
                  {
                    onClick: mockOnClick,
                    title: 'Test Action',
                    variant: 'primary'
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        const actionButton = screen.getByText('Test Action')

        await user.click(actionButton)

        expect(mockOnClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when additionalActions are defined', () => {
    test('displays the dropdown', () => {
      render(
        <BrowserRouter>
          <Page
            title="Test page"
            additionalActions={
              [
                {
                  count: 10,
                  onClick: () => {},
                  title: 'Test Action'
                }
              ]
            }
          >
            This is some page content
          </Page>
        </BrowserRouter>
      )

      const actionButton = screen.queryByText(/More Actions/)

      expect(actionButton).toBeInTheDocument()
    })

    describe('when clicking the more actions button', () => {
      test('displays the dropdown', async () => {
        const user = userEvent.setup()
        const mockOnClick = vi.fn()

        render(
          <BrowserRouter>
            <Page
              title="Test page"
              additionalActions={
                [
                  {
                    count: 10,
                    onClick: mockOnClick,
                    title: 'Test Action'
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        const actionButton = screen.queryByText(/Test Action/)

        expect(actionButton).toBeInTheDocument()
      })
    })

    describe('when clicking the action button', () => {
      test('calls the onClick', async () => {
        const user = userEvent.setup()
        const mockOnClick = vi.fn()

        render(
          <BrowserRouter>
            <Page
              title="Test page"
              additionalActions={
                [
                  {
                    count: 10,
                    onClick: () => {
                      mockOnClick()
                    },
                    title: 'Test Action'
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        const moreActionsButton = screen.queryByText(/More Actions/)

        await user.click(moreActionsButton)

        const actionButton = screen.queryByText(/Test Action/)

        await user.click(actionButton.parentElement)

        await waitFor(() => {
          expect(mockOnClick).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('when rendering a secondary page', () => {
    describe('when breadcrumbs are defined', () => {
      test('displays the breadcrumbs', () => {
        render(
          <BrowserRouter>
            <Page
              title="Test page"
              breadcrumbs={
                [
                  {
                    label: 'Test Breadcrumb',
                    to: '/test-breadcrumb'
                  },
                  {
                    label: 'Test Active Breadcrumb',
                    to: '/test-active-breadcrumb',
                    active: true
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        expect(screen.getByText('Test Breadcrumb')).toBeInTheDocument()
        expect(screen.getByText('Test Breadcrumb')).not.toHaveClass('active')
        expect(screen.getByText('Test Breadcrumb').href).toEqual('http://localhost:3000/test-breadcrumb')

        expect(screen.getByText('Test Active Breadcrumb')).toBeInTheDocument()
        expect(screen.getByText('Test Active Breadcrumb')).toHaveClass('active')
        expect(screen.getByText('Test Active Breadcrumb').href).toEqual(undefined)
      })
    })

    describe('when breadcrumbs contain an undefined value', () => {
      test('displays the breadcrumbs', () => {
        render(
          <BrowserRouter>
            <Page
              title="Test page"
              breadcrumbs={
                [
                  {
                    label: 'Test Breadcrumb',
                    to: '/test-breadcrumb'
                  },
                  (
                    false && {
                      label: 'Conditional Breadcrumb',
                      to: '/conditional-breadcrumb'
                    }
                  ),
                  {
                    label: 'Test Active Breadcrumb',
                    to: '/test-active-breadcrumb',
                    active: true
                  }
                ]
              }
            >
              This is some page content
            </Page>
          </BrowserRouter>
        )

        expect(screen.getAllByText('Breadcrumb', { exact: false }).length).toEqual(2)
      })
    })
  })
})
