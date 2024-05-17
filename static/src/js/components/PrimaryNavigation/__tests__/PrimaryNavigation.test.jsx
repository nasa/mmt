import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import PrimaryNavigation from '../PrimaryNavigation'

describe('PrimaryNavigation component', () => {
  test('renders the primary navigation', async () => {
    render(
      <MemoryRouter>
        <PrimaryNavigation
          items={
            [
              {
                title: 'Home',
                to: '/'
              },
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
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Link 1')).toBeInTheDocument()
    expect(screen.getByText('Link 2')).toBeInTheDocument()
  })

  describe('when a link is active', () => {
    test('sets the active element', async () => {
      render(
        <MemoryRouter>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Home',
                  to: '/'
                },
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
          />
        </MemoryRouter>
      )

      expect(screen.getByText('Home').parentElement.parentElement.className).toContain('active')
    })
  })

  describe('when a link has a version', () => {
    test('displays the version', async () => {
      render(
        <MemoryRouter>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Link 1',
                  to: '/link-1',
                  version: 'v1.0'
                },
                {
                  title: 'Link 2',
                  to: '/link-2'
                }
              ]
            }
          />
        </MemoryRouter>
      )

      expect(screen.getByText('v1.0')).toHaveTextContent('v1.0')
    })
  })

  describe('when a dropdown button is clicked', () => {
    test('sets the parent to open', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Home',
                  to: '/'
                },
                {
                  title: 'Link 1',
                  to: '/link-1',
                  children: [
                    {
                      title: 'Child Link 1',
                      to: '/child-link-1'
                    }
                  ]
                },
                {
                  title: 'Link 2',
                  to: '/link-2'
                }
              ]
            }
          />
        </MemoryRouter>
      )

      const link = screen.getByRole('link', { name: 'Link 1' })
      const button = within(link.parentElement).getByRole('button', { name: 'Open icon' })

      await user.click(button)

      expect(screen.getByRole('button', { name: 'Close icon' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Child Link 1' })).toBeVisible()
    })
  })

  describe('when a child link is active', () => {
    test('sets the parent to open', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Home',
                  to: '/'
                },
                {
                  title: 'Link 1',
                  to: '/link-1',
                  children: [
                    {
                      title: 'Child Link 1',
                      to: '/child-link-1'
                    }
                  ]
                },
                {
                  title: 'Link 2',
                  to: '/link-2'
                }
              ]
            }
          />
        </MemoryRouter>
      )

      expect(screen.getByRole('link', { name: 'Child Link 1' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Close icon' })).toBeInTheDocument()
    })
  })

  describe('when a link is not visible', () => {
    test('does not show the link', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Home',
                  to: '/'
                },
                {
                  title: 'Link 1',
                  to: '/link-1',
                  children: [
                    {
                      title: 'Child Link 1',
                      to: '/child-link-1'
                    }
                  ]
                },
                {
                  title: 'Link 2',
                  to: '/link-2',
                  visible: false
                }
              ]
            }
          />
        </MemoryRouter>
      )

      expect(screen.queryByRole('link', { name: 'Link 2' })).not.toBeInTheDocument()
    })
  })

  describe('when a child link is not visible', () => {
    test('does not show the link', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <PrimaryNavigation
            items={
              [
                {
                  title: 'Home',
                  to: '/'
                },
                {
                  title: 'Link 1',
                  to: '/link-1',
                  children: [
                    {
                      title: 'Child Link 1',
                      to: '/child-link-1',
                      visible: false
                    }
                  ]
                },
                {
                  title: 'Link 2',
                  to: '/link-2'
                }
              ]
            }
          />
        </MemoryRouter>
      )

      expect(screen.queryByRole('link', { name: 'Child Link 1' })).not.toBeInTheDocument()
    })
  })
})
