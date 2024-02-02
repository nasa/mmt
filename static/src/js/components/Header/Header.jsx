import React from 'react'
import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import Navbar from 'react-bootstrap/Navbar'
import {
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa'

import useAppContext from '../../hooks/useAppContext'
import Button from '../Button/Button'

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
  const { user, login, logout } = useAppContext()

  return (
    <header className="header bg-primary shadow z-1">
      <Container>
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
              !user?.name && (
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    className="text-white me-1"
                    naked
                    Icon={FaQuestionCircle}
                    href="https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide"
                    external
                  >
                    User Guide
                  </Button>
                  <Button
                    className="text-white"
                    Icon={FaSignInAlt}
                    variant="blue-light"
                    onClick={
                      () => {
                        login()
                      }
                    }
                  >
                    Log in with Launchpad
                  </Button>
                </div>
              )
            }
            {
              user?.name && (
                <Dropdown className="mb-2" align="end">
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    as={Badge}
                    className="bg-blue-light pointer"
                    role="button"
                  >
                    {`${user.name} `}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="bg-blue-light border-blue-light shadow text-white"
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
                      onClick={
                        () => {
                          logout()
                        }
                      }
                    >
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )
            }

            {
              user?.name && (
                <Form className="flex-grow-1 w-100">
                  <FormGroup>
                    <InputGroup>
                      <FormControl type="text" placeholder="Enter a search term" size="sm" />
                      <Dropdown align="end" as={ButtonGroup}>
                        <Button
                          size="sm"
                          className="d-flex align-items-center"
                          variant="indigo"
                        >
                          <FaSearch className="me-2" />
                          Search Collections
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant="indigo"
                          id="search-options-dropdown"
                          aria-label="Search Options"
                        />
                        <DropdownMenu id="search-options-dropdown" className="bg-indigo text-white p-3 shadow">
                          <div className="mb-2">
                            <h4 className="h6">Choose the metadata type</h4>
                            [metadata radio selection]
                          </div>
                          <div>
                            <h4 className="h6">Select provider</h4>
                            [provider dropdown selection]
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </InputGroup>
                  </FormGroup>
                </Form>
              )
            }
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  )
}

export default Header
