import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import PrimaryNavigation from '../PrimaryNavigation'

describe('PrimaryNavigation component', () => {
  test('renders the primary navigation', async () => {
    render(
      <BrowserRouter>
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
      </BrowserRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Link 1')).toBeInTheDocument()
    expect(screen.getByText('Link 2')).toBeInTheDocument()
  })

  describe('when a link is active', () => {
    test('sets the active element', async () => {
      render(
        <BrowserRouter>
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
        </BrowserRouter>
      )

      expect(screen.getByText('Home').parentElement.className).toContain('active')
    })
  })

  describe('when a link has a version', () => {
    test('displays the version', async () => {
      render(
        <BrowserRouter>
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
        </BrowserRouter>
      )

      expect(screen.getByText('v1.0')).toHaveTextContent('v1.0')
    })
  })
})
