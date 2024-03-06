import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import FormLabel from 'react-bootstrap/FormLabel'
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
import isTokenExpired from '../../utils/isTokenExpired'

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
    user, login, logout, providerIds, setProviderId
  } = useAppContext()
  const navigate = useNavigate()
  const { token, name = '' } = user
  const isExpired = isTokenExpired(token)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType] = useState('collections')

  const onSearchChange = (e) => {
    const { target: { value } } = e
    setSearchKeyword(value)
  }

  const onSearchSubmit = () => {
    navigate(`/search?type=${searchType}&keyword=${searchKeyword}`)
  }

  // Define the renderProviderDropdownItems function
  const renderProviderDropdownItems = () => {
    if (!providerIds) {
      return null
    }

    return providerIds.map((providerId) => (
      <Dropdown.Item
        key={providerId}
        onClick={() => setProviderId(providerId)}
      >
        {providerId}
      </Dropdown.Item>
    ))
  }

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
              (isExpired) && (
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
              (!isExpired) && (
                <div className="d-flex p-1 mb-2 rounded bg-blue-light">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      as={Badge}
                      className="bg-blue-light pointer"
                      role="button"
                    >
                      {`${name} `}
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

                  <Dropdown className="me-0.5" align="end">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        as={Badge}
                        className="pointer"
                        role="button"
                      >
                        {user.providerId}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="bg-blue-light border-blue-light shadow text-white"
                      >
                        {renderProviderDropdownItems()}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown>
                </div>
              )
            }

            {
              user?.name && (
                <Form
                  className="flex-grow-1 w-100"
                  onSubmit={
                    (e) => {
                      onSearchSubmit()
                      e.preventDefault()
                    }
                  }
                >
                  <FormGroup>
                    <InputGroup>
                      <FormLabel className="visually-hidden" htmlFor="search_mmt">Search</FormLabel>
                      <FormControl
                        id="search_mmt"
                        type="text"
                        placeholder="Enter a search term"
                        size="sm"
                        onChange={onSearchChange}
                      />
                      <Dropdown align="end" as={ButtonGroup}>
                        <Button
                          size="sm"
                          className="d-flex align-items-center"
                          variant="indigo"
                          onClick={onSearchSubmit}
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
