import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Outlet } from 'react-router-dom'
import classNames from 'classnames'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import {
  FaBook,
  FaExternalLinkAlt,
  FaList,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserAlt
} from 'react-icons/fa'

import useAuthContext from '@/js/hooks/useAuthContext'
import usePermissions from '@/js/hooks/usePermissions'

import Button from '../Button/Button'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PrimaryNavigation from '../PrimaryNavigation/PrimaryNavigation'
import AboutModal from '../AboutModal/AboutModal'

import { getUmmVersionsConfig } from '../../../../../sharedUtils/getConfig'

import './Layout.scss'

/*
 * Renders a `Layout` component.
 *
 * The component is used to render the Layout for React Router
 *
 * @component
 * @example <caption>Render Layout component</caption>
 * return (
 *   <Layout />
 * )
 */
const Layout = ({ className, displayNav }) => {
  const {
    ummC,
    ummS,
    ummT,
    ummV
  } = getUmmVersionsConfig()

  const { user } = useAuthContext()

  const { hasSystemGroup, loading } = usePermissions({
    systemGroup: ['read']
  })

  const [showAboutModal, setShowAboutModal] = useState(false)

  if (loading) return null

  const canViewGroups = hasSystemGroup
  const canViewAdmin = canViewGroups // || canView* other permission if needed

  return (
    <>
      <div
        className="flex w-100 flex-grow-0"
      >
        <ErrorBoundary>
          <main
            className={
              classNames([
                'w-100 h-100 d-flex flex-column flex-grow-0 flex-md-row',
                {
                  [className]: className
                }
              ])
            }
          >
            {
              displayNav && (
                <Navbar
                  className="layout__sidebar d-flex flex-column flex-md-row md-w-100 align-items-stretch flex-grow-0 md-flex-grow-1 flex-shrink-0 bg-light py-0"
                  expand="md"
                >
                  <section className="d-flex flex-column overflow-y-auto flex-shrink-1">
                    <div className="px-2 py-4 flex-shrink-0 flex-grow-0 d-flex flex-row justify-content-between">
                      <Navbar.Brand className="d-block nasa text-wrap text-dark" as={Link} to="/">
                        <span className="layout__brand-earthdata d-block text-uppercase">Earthdata</span>
                        Metadata Management Tool
                      </Navbar.Brand>
                      <Navbar.Toggle aria-controls="primary-navigation" />
                    </div>
                    <Navbar.Collapse
                      id="primary-navigation"
                      className="flex-column align-items-stretch"
                    >
                      <PrimaryNavigation
                        items={
                          [
                            [
                              {
                                title: 'Collections',
                                version: `v${ummC}`,
                                children: [
                                  {
                                    to: '/collections',
                                    title: 'All Collections'
                                  },
                                  {
                                    to: '/drafts/collections',
                                    title: 'Drafts'
                                  },
                                  {
                                    to: '/templates/collections',
                                    title: 'Templates'
                                  },
                                  {
                                    to: '/permissions',
                                    title: 'Permissions'
                                  }
                                ]
                              },
                              {
                                title: 'Variables',
                                version: `v${ummV}`,
                                children: [
                                  {
                                    to: '/variables',
                                    title: 'All Variables'
                                  },
                                  {
                                    to: '/drafts/variables',
                                    title: 'Drafts'
                                  }
                                ]
                              },
                              {
                                title: 'Services',
                                version: `v${ummS}`,
                                children: [
                                  {
                                    to: '/services',
                                    title: 'All Services'
                                  },
                                  {
                                    to: '/drafts/services',
                                    title: 'Drafts'
                                  }
                                ]
                              },
                              {
                                title: 'Tools',
                                version: `v${ummT}`,
                                children: [
                                  {
                                    to: '/tools',
                                    title: 'All Tools'
                                  },
                                  {
                                    to: '/drafts/tools',
                                    title: 'Drafts'
                                  }
                                ]
                              },
                              {
                                title: 'Order Options',
                                children: [
                                  {
                                    to: '/order-options',
                                    title: 'All Order Options'
                                  }
                                ]
                              },
                              {
                                title: 'Groups',
                                children: [
                                  {
                                    to: '/groups',
                                    title: 'All Groups'
                                  }
                                ]
                              }
                            ],
                            [
                              {
                                title: 'Admin',
                                visible: canViewAdmin,
                                children: [
                                  {
                                    to: '/admin/groups',
                                    title: 'System Groups',
                                    visible: canViewGroups
                                  }
                                ]
                              }
                            ]
                          ]
                        }
                      />
                      <div
                        className="rounded p-2 border-top mt-auto"
                      >
                        <Dropdown className="d-block text-secondary" drop="up">
                          <Dropdown.Toggle
                            id="user-dropdown"
                            className="pointer px-2"
                            role="button"
                            size="sm"
                            as={Button}
                            iconTitle="Arrow pointing up"
                            naked
                            Icon={FaUserAlt}
                          >
                            {`${user.name} `}
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            className="bg-light-dark shadow"
                          >
                            <Dropdown.Item
                              className="layout__user-dropdown-item bg-light-dark d-flex align-items-center small"
                              onClick={
                                () => {
                                  setShowAboutModal(true)
                                }
                              }
                            >
                              <FaQuestionCircle className="me-2" />
                              About
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="layout__user-dropdown-item bg-light-dark d-flex align-items-center small"
                              href="https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide"
                              target="_blank"
                            >
                              <FaBook className="me-2" />
                              User Guide
                              <FaExternalLinkAlt className="ms-2 small" style={{ opacity: 0.625 }} />
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="layout__user-dropdown-item bg-light-dark small"
                              as={Link}
                              to="/providers"
                            >
                              <FaList className="me-2" />
                              My Providers
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="layout__user-dropdown-item bg-light-dark small"
                              as={Link}
                              to="/logout"
                            >
                              <FaSignOutAlt className="me-2" />
                              Logout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Navbar.Collapse>
                  </section>
                </Navbar>
              )
            }
            <Outlet />
          </main>
        </ErrorBoundary>
      </div>
      <AboutModal show={showAboutModal} toggleModal={(state) => { setShowAboutModal(state) }} />
    </>
  )
}

Layout.defaultProps = {
  className: '',
  displayNav: true
}

Layout.propTypes = {
  className: PropTypes.string,
  displayNav: PropTypes.bool
}

export default Layout
