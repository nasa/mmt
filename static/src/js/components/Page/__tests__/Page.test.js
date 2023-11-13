import React from 'react'
import { render, screen } from '@testing-library/react'
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
        to: '/manage-collections',
        title: 'Manage Collections',
        version: 'v1.17.3'
      },
      {
        to: '/manage-variables',
        title: 'Manage Variables',
        version: 'v1.9.0'
      },
      {
        to: '/manage-services',
        title: 'Manage Services',
        version: 'v1.4'
      },
      {
        to: '/manage-tools',
        title: 'Manage Tools',
        version: 'v1.1'
      },
      {
        to: '/manage-cmr',
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
    expect(screen.getByText('Test page')).toHaveClass('visually-hidden')
  })

  test('renders the content', () => {
    render(
      <Page title="Test page">
        This is some page content
      </Page>
    )

    expect(screen.getByText('This is some page content')).toBeInTheDocument()
  })
})
