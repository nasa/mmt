import { FaQuestionCircle, FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import PropTypes from 'prop-types'
import React from 'react'

import Button from '@/js/components/Button/Button'

import useAuthContext from '@/js/hooks/useAuthContext'

import './Header.scss'

/**
 * Renders a `Header` component
 *
 * @component
 * @example <caption>Renders a `Header` component</caption>
 * return (
 *   <Header />
 * )
 * OR if using just the banner with no login option
 * return (
 *  <Header noLogin />
 * )
 */
const Header = ({ noLogin }) => {
  const {
    login
  } = useAuthContext()

  return (
    <header className="header bg-primary z-n3 px-4">
      <Navbar
        bg="primary"
        className="w-100 d-flex align-items-center justify-content-between py-3"
        collapseOnSelect
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand className="nasa text-wrap" as={Link} to="/">
          <span className="header__brand-earthdata d-block text-uppercase">Earthdata</span>
          Metadata Management Tool
        </Navbar.Brand>

        {
          !noLogin && (
            <>
              <Navbar.Toggle aria-controls="primary-navigation" />
              <Navbar.Collapse
                className="header__navbar-collapse flex-column align-items-end"
                id="primary-navigation"
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    className="text-white me-1"
                    external
                    href="https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide"
                    Icon={FaQuestionCircle}
                    iconTitle="Question mark in a circle"
                    naked
                  >
                    User Guide
                  </Button>

                  <Button
                    className="text-white"
                    Icon={FaSignInAlt}
                    iconTitle="Door with arrow pointing inward"
                    onClick={login}
                    variant="blue-light"
                  >
                    Log in with Launchpad
                  </Button>
                </div>
              </Navbar.Collapse>
            </>
          )
        }
      </Navbar>
    </header>
  )
}

Header.defaultProps = {
  noLogin: false
}

Header.propTypes = {
  noLogin: PropTypes.bool
}

export default Header
