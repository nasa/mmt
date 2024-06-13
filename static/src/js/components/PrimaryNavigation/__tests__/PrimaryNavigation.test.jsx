import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import PrimaryNavigation from '../PrimaryNavigation'

describe('PrimaryNavigation component', () => {
  test('renders the primary navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/link-1']}>
        <Routes>
          <Route
            path="/link-1"
            element={
              (
                <PrimaryNavigation
                  items={
                    [
                      [
                        {
                          title: 'Home',
                          children: [
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
                      ]
                    ]
                  }
                />
              )
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Link 1')).toBeInTheDocument()
    expect(screen.getByText('Link 2')).toBeInTheDocument()
  })

  describe('when a link is active', () => {
    test('sets the active element', async () => {
      render(
        <MemoryRouter initialEntries={['/link-1']}>
          <Routes>
            <Route
              path="/link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Home',
                            children: [
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
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByRole('link', { name: 'Link 1' })).toHaveClass('active')
    })
  })

  describe('when a link has a version', () => {
    test('displays the version', async () => {
      render(
        <MemoryRouter initialEntries={['/link-1']}>
          <Routes>
            <Route
              path="/link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Home',
                            version: 'v1.0',
                            children: [
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
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('v1.0')).toHaveTextContent('v1.0')
    })
  })

  describe('when a dropdown button is clicked', () => {
    test('sets the parent to open', async () => {
      const user = userEvent.setup()
      render(
        <MemoryRouter initialEntries={['/link-1']}>
          <Routes>
            <Route
              path="/link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Group 1',
                            children: [
                              {
                                title: 'Link 1',
                                to: '/link-1'
                              }
                            ]
                          },
                          {
                            title: 'Group 2',
                            children: [
                              {
                                title: 'Link 2',
                                to: '/link-2'
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      const button = await screen.findByLabelText('Open menu')
      const closeButtonsWhileClosed = await screen.findAllByLabelText('Close menu')

      expect(closeButtonsWhileClosed).toHaveLength(1)
      expect(screen.queryByRole('link', { name: 'Link 2' })).not.toBeInTheDocument()

      await user.click(button)

      const closeButtonsWhileOpen = await screen.findAllByLabelText('Close menu')

      expect(closeButtonsWhileOpen).toHaveLength(2)
      expect(screen.getByRole('link', { name: 'Link 2' })).toBeInTheDocument()
    })
  })

  describe('when a child link is active', () => {
    test('sets the parent section to open', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <Routes>
            <Route
              path="/child-link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Link 1',
                            children: [
                              {
                                title: 'Child Link 1',
                                to: '/child-link-1'
                              }
                            ]
                          },
                          {
                            title: 'Link 2',
                            children: [
                              {
                                title: 'Child Link 2',
                                to: '/child-link-2'
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByRole('link', { name: 'Child Link 1' })).toBeVisible()
      expect(screen.queryByRole('link', { name: 'Child Link 2' })).not.toBeInTheDocument()
    })
  })

  describe('when a section is not visible', () => {
    test('does not show the link', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <Routes>
            <Route
              path="/child-link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Link 1',
                            children: [
                              {
                                title: 'Child Link 1',
                                to: '/child-link-1'
                              }
                            ]
                          },
                          {
                            title: 'Link 2',
                            visible: false,
                            children: [
                              {
                                title: 'Child Link 2',
                                to: '/child-link-2'
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByText('Link 2')).not.toBeInTheDocument()
    })
  })

  describe('when a child link is not visible', () => {
    test('does not show the link', async () => {
      render(
        <MemoryRouter initialEntries={['/child-link-1']}>
          <Routes>
            <Route
              path="/child-link-1"
              element={
                (
                  <PrimaryNavigation
                    items={
                      [
                        [
                          {
                            title: 'Link 1',
                            children: [
                              {
                                title: 'Child Link 1',
                                to: '/child-link-1'
                              },
                              {
                                title: 'Child Link 2',
                                to: '/child-link-2',
                                visible: false
                              }
                            ]
                          },
                          {
                            title: 'Link 2',
                            children: [
                              {
                                title: 'Child Link 3',
                                to: '/child-link-3'
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  />
                )
              }
            />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByRole('link', { name: 'Child Link 2' })).not.toBeInTheDocument()
    })
  })
})
