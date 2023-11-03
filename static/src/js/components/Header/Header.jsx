import React from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Navbar
} from 'react-bootstrap'
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
  <header className="header">
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand className="nasa" as={Link} to="/">
          <span className="header__brand-earthdata d-block text-uppercase">Earthdata</span>
          Metadata Management Tool
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="primary-navigation" />
        <Navbar.Collapse id="primary-navigation" className="d-flex flex-column align-items-end">
          <Badge className="header__user-info mb-3" bg="blue-light">
            Hi, User
          </Badge>
          <Form>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" placeholder="Search MMT" />
                <Button
                  variant="indigo"
                  className="d-flex align-items-center"
                >
                  <FaSearch className="me-2" />
                  Search Collections
                </Button>
                <Dropdown align="end">
                  <DropdownButton
                    className="header__dropdown-button-title"
                    title={(
                      <span className="visually-hidden">Search Options</span>
                    )}
                    variant="indigo"
                    align="end"
                  >
                    Search collections
                  </DropdownButton>
                </Dropdown>
              </InputGroup>
            </FormGroup>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
)

export default Header
