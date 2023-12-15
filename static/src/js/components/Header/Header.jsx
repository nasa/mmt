import React from 'react'
import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import Navbar from 'react-bootstrap/Navbar'
import { FaSearch } from 'react-icons/fa'

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
const Header = () => (
  <header className="header bg-primary">
    <Container>
      <Navbar
        className="w-100"
        bg="primary"
        collapseOnSelect
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand className="nasa" as={Link} to="/">
          <span className="header__brand-earthdata d-block text-uppercase">Earthdata</span>
          Metadata Management Tool
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="primary-navigation" />

        <Navbar.Collapse id="primary-navigation" className="flex-column align-items-end pt-3">
          <Badge className="header__user-info mb-3" bg="blue-light">
            Hi, User
          </Badge>

          <Form>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" placeholder="Search MMT" />

                <Button
                  className="d-flex align-items-center"
                  variant="indigo"
                >
                  <FaSearch className="me-2" />
                  Search Collections
                </Button>

                <Dropdown align="end">
                  <DropdownButton
                    align="end"
                    className="header__dropdown-button-title"
                    title={(
                      <span className="visually-hidden">Search Options</span>
                    )}
                    variant="indigo"
                  >
                    Search collections
                  </DropdownButton>
                </Dropdown>
              </InputGroup>
            </FormGroup>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  </header>
)

export default Header
