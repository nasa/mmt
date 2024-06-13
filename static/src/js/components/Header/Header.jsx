import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import { FaQuestionCircle, FaSignInAlt } from 'react-icons/fa'

import Button from '@/js/components/Button/Button'

import useAuthContext from '@/js/hooks/useAuthContext'

import './Header.scss'
import { Link } from 'react-router-dom'

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
    login
  } = useAuthContext()

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
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Header
