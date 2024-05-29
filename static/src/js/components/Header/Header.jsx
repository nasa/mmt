import React from 'react'
import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Dropdown from 'react-bootstrap/Dropdown'
import Navbar from 'react-bootstrap/Navbar'
import {
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa'

import Button from '@/js/components/Button/Button'

import useAuthContext from '@/js/hooks/useAuthContext'

import isTokenExpired from '@/js/utils/isTokenExpired'

import './Header.scss'

/**
 * Renders a `Header` component
 *
 * @component
 * @example <caption>Renders a `Header` component</caption>
 * return (
 *   <Header />
 * )
 */
const Header = () => {
  const {
    login,
    user,
    tokenExpires
  } = useAuthContext()

  const isLoggedIn = !isTokenExpired(tokenExpires)

  return (
    <header className="header bg-primary z-n3 px-4">
      <Navbar
        className="w-100 d-flex align-items-center justify-content-between py-3"
        bg="primary"
        collapseOnSelect
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand className="nasa text-wrap" as={Link} to="/">
          <span className="header__brand-earthdata d-block text-uppercase">Earthdata</span>
          Metadata Management Tool
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="primary-navigation" />

        <Navbar.Collapse
          id="primary-navigation"
          className="header__navbar-collapse flex-column align-items-end"
        >
          {
            !isLoggedIn && (
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  className="text-white me-1"
                  naked
                  Icon={FaQuestionCircle}
                  iconTitle="Question mark in a circle"
                  href="https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide"
                  external
                >
                  User Guide
                </Button>

                <Button
                  className="text-white"
                  Icon={FaSignInAlt}
                  iconTitle="Door with arrow pointing inward"
                  variant="blue-light"
                  onClick={login}
                >
                  Log in with Launchpad
                </Button>
              </div>
            )
          }

          {
            isLoggedIn && (
              <div className="d-flex p-1 mb-2 rounded bg-blue-light">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    id="user-dropdown"
                    as={Badge}
                    bg={null}
                    className="header__user-dropdown-toggle pointer"
                    role="button"
                  >
                    {`${user.name} `}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="header__user-dropdown bg-blue-light border-blue-light shadow text-white"
                  >
                    <Dropdown.Item
                      className="text-white bg-blue-light d-flex align-items-center"
                      href="https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide"
                      target="_blank"
                    >
                      <FaQuestionCircle className="me-2" />
                      User Guide
                      <FaExternalLinkAlt className="ms-1 small" style={{ opacity: 0.625 }} />
                    </Dropdown.Item>

                    <Dropdown.Item
                      className="text-white bg-blue-light"
                      href="/logout"
                    >
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )
          }
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Header
