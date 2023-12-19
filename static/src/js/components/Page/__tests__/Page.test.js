import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import MockPrimaryNavigation from '../../PrimaryNavigation/PrimaryNavigation'

import Page from '../Page'

jest.mock('../../PrimaryNavigation/PrimaryNavigation', () => ({
  __esModule: true,
  default: jest.fn(() => (
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
        to: '/manage/collections',
        title: 'Manage Collections',
        version: 'v1.17.3'
      },
      {
        to: '/manage/variables',
        title: 'Manage Variables',
        version: 'v1.9.0'
      },
      {
        to: '/manage/services',
        title: 'Manage Services',
        version: 'v1.4'
      },
      {
        to: '/manage/tools',
        title: 'Manage Tools',
        version: 'v1.1'
      },
      {
        to: '/manage/cmr',
        title: 'Manage CMR'
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

  describe('when actions are defined', () => {
    test('displays the action', () => {
      render(
        <BrowserRouter>
          <Page
            title="Test page"
            headerActions={
              [
                {
                  label: 'Test Action',
                  to: '/test-action'
                }
              ]
            }
          >
            This is some page content
          </Page>
        </BrowserRouter>
      )

      expect(screen.getByText('Test Action')).toBeInTheDocument()
      expect(screen.getByText('Test Action').href).toEqual('http://localhost/test-action')
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
        expect(screen.getByText('Test Breadcrumb').href).toEqual('http://localhost/test-breadcrumb')

        expect(screen.getByText('Test Active Breadcrumb')).toBeInTheDocument()
        expect(screen.getByText('Test Active Breadcrumb')).toHaveClass('active')
        expect(screen.getByText('Test Active Breadcrumb').href).toEqual(undefined)
      })
    })
  })
})
