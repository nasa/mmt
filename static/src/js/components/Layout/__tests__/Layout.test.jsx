import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import usePermissions from '@/js/hooks/usePermissions'

import Footer from '../../Footer/Footer'
import Header from '../../Header/Header'
import Layout from '../Layout'
import PrimaryNavigation from '../../PrimaryNavigation/PrimaryNavigation'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

vi.mock('@/js/hooks/usePermissions')
vi.mock('../../Footer/Footer')
vi.mock('../../Header/Header')
vi.mock('../../PrimaryNavigation/PrimaryNavigation')

const setup = () => {
  vi.spyOn(getConfig, 'getUmmVersionsConfig').mockImplementation(() => ({
    ummC: 'mock-umm-c',
    ummS: 'mock-umm-s',
    ummT: 'mock-umm-t',
    ummV: 'mock-umm-v'
  }))

  render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              (
                <>
                  This is some content
                </>
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

describe('Layout component', () => {
  test('renders the content to the React Router Outlet', async () => {
    usePermissions.mockReturnValue({ hasSystemGroup: true })

    setup()

    expect(screen.getByText('This is some content')).toBeInTheDocument()

    expect(Header).toHaveBeenCalledTimes(1)
    expect(Footer).toHaveBeenCalledTimes(1)

    expect(usePermissions).toHaveBeenCalledTimes(1)
    expect(usePermissions).toHaveBeenCalledWith({
      systemGroup: ['read']
    })

    expect(PrimaryNavigation).toHaveBeenCalledTimes(1)
    expect(PrimaryNavigation).toHaveBeenCalledWith({
      items: [
        {
          to: '/collections',
          title: 'Collections',
          version: 'vmock-umm-c',
          children: [
            {
              to: '/drafts/collections',
              title: 'Drafts'
            },
            {
              to: '/templates/collections',
              title: 'Templates'
            },
            {
              title: 'Permissions',
              to: '/permissions'
            }
          ]
        },
        {
          to: '/variables',
          title: 'Variables',
          version: 'vmock-umm-v',
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
          version: 'vmock-umm-s',
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
          version: 'vmock-umm-t',
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
        },
        {
          to: '/groups',
          title: 'Groups'
        },
        {
          to: '/admin',
          title: 'Admin',
          visible: true,
          children: [
            {
              to: '/admin/groups',
              title: 'System Groups',
              visible: true
            }
          ]
        }
      ]
    }, {})
  })

  describe('when the user does not have system group permissions', () => {
    test('does not render the admin links', async () => {
      usePermissions.mockReturnValue({ hasSystemGroup: false })

      setup()

      expect(screen.getByText('This is some content')).toBeInTheDocument()

      expect(Header).toHaveBeenCalledTimes(1)
      expect(Footer).toHaveBeenCalledTimes(1)

      expect(PrimaryNavigation).toHaveBeenCalledTimes(1)
      expect(PrimaryNavigation).toHaveBeenCalledWith({
        items: [
          {
            to: '/collections',
            title: 'Collections',
            version: 'vmock-umm-c',
            children: [
              {
                to: '/drafts/collections',
                title: 'Drafts'
              },
              {
                to: '/templates/collections',
                title: 'Templates'
              },
              {
                title: 'Permissions',
                to: '/permissions'
              }
            ]
          },
          {
            to: '/variables',
            title: 'Variables',
            version: 'vmock-umm-v',
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
            version: 'vmock-umm-s',
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
            version: 'vmock-umm-t',
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
          },
          {
            to: '/groups',
            title: 'Groups'
          },
          {
            to: '/admin',
            title: 'Admin',
            visible: false,
            children: [
              {
                to: '/admin/groups',
                title: 'System Groups',
                visible: false
              }
            ]
          }
        ]
      }, {})
    })
  })
})
