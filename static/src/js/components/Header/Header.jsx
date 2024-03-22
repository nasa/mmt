import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import {
  capitalize,
  isNil,
  omitBy,
  orderBy
} from 'lodash-es'
import { useQuery } from '@apollo/client'
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
import FormSelect from 'react-bootstrap/FormSelect'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import {
  FaCheck,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa'

import { GET_PROVIDERS } from '../../operations/queries/getProviders'

import useAppContext from '../../hooks/useAppContext'

import Button from '../Button/Button'
import For from '../For/For'

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
    user,
    login,
    logout,
    providerIds,
    setProviderId
  } = useAppContext()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const [searchType, setSearchType] = useState('collections')
  const [searchProvider, setSearchProvider] = useState()

  // Set the input with the value from the keyword search param if one exists
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '')

  useEffect(() => {
    const currentSearchType = searchParams.get('type')
    const currentSearchProvider = searchParams.get('provider')

    // If there is a search type or provider defined in the url, use that.
    if (currentSearchType) {
      setSearchType(currentSearchType)
    }

    if (currentSearchProvider) {
      setSearchProvider(currentSearchProvider)
    }
  }, [searchParams])

  const {
    data: providersData,
    loading: providersLoading,
    error: providersError
  } = useQuery(GET_PROVIDERS)

  // Callback for the search input change
  const onSearchChange = (e) => {
    const { target: { value } } = e
    setSearchKeyword(value)
  }

  // Callback for submitting the search form
  const onSearchSubmit = () => {
    const allParams = {
      type: searchType,
      keyword: searchKeyword,
      provider: searchProvider
    }

    // Remove any null search params
    const prunedParams = omitBy(allParams, isNil)

    const params = new URLSearchParams(prunedParams)

    // Navigate to the search params with any of the defined params in the url
    navigate(`/search?${params.toString()}`)
  }

  // Callback for the search type change
  const onSearchTypeChange = useCallback((e) => {
    setSearchType(e.target.value)
  }, [])

  // Callback for changing the provider select value
  const onSearchProviderChange = useCallback((e) => {
    setSearchProvider(e.target.value)
  }, [])

  return (
    <header className="header bg-primary shadow z-n3">
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
              user?.name && (
                <div className="d-flex p-1 mb-2 rounded bg-blue-light">
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      id="user-dropdown"
                      as={Badge}
                      bg={null}
                      className="header__user-dropdown-toggle pointer me-1"
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
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      id="provider-dropdown"
                      as={Badge}
                      bg={null}
                      className="header__prov-dropdown-toggle pointer"
                      role="button"
                    >
                      {user.providerId}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="header__prov-dropdown bg-blue-light border-blue-light shadow text-white"
                    >
                      {
                        providerIds?.length > 0 && (
                          <>
                            <span className="header__prov-dropdown-header d-block px-3 my-2 fw-bold">Choose a provider context</span>
                            <div className="header__prov-dropdown-items-wrapper">
                              <For each={providerIds}>
                                {
                                  (providerId) => (
                                    <Dropdown.Item
                                      key={providerId}
                                      className="header__prov-dropdown-item d-flex align-items-center justify-content-between text-white"
                                      active={providerId === user.providerId}
                                      onClick={() => setProviderId(providerId)}
                                    >
                                      {providerId}
                                      {
                                        providerId === user.providerId && (
                                          <Badge className="ms-2 d-flex align-items-center" bg="indigo">
                                            <FaCheck className="me-1" />
                                            {' Selected'}
                                          </Badge>
                                        )
                                      }
                                    </Dropdown.Item>
                                  )
                                }
                              </For>
                            </div>
                          </>
                        )
                      }
                    </Dropdown.Menu>
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
                        className="rounded-start-1 border-0"
                        type="text"
                        placeholder="Enter a search term"
                        size="sm"
                        value={searchKeyword}
                        onChange={onSearchChange}
                      />
                      <Dropdown align="end" as={ButtonGroup}>
                        <Button
                          size="sm"
                          className="d-flex align-items-center col-4 border-0"
                          variant="indigo"
                          onClick={onSearchSubmit}
                          type="submit"
                        >
                          <FaSearch className="me-2" />
                          {`Search ${capitalize(searchType)}`}
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant="indigo"
                          id="search-options-dropdown"
                          aria-label="Search Options"
                        />
                        <DropdownMenu id="search-options-dropdown" className="bg-indigo text-light p-3 shadow">
                          <div className="mb-2 text-align-right">
                            <FormGroup>
                              <FormLabel className="d-block fw-bold mb-3" htmlFor="metadata-type">Choose metadata type</FormLabel>
                              <div className="align-middle mb-4">
                                <Form.Check
                                  id="search-type_collections"
                                  className="d-inline-flex align-items-center gap-2"
                                  inline
                                  type="radio"
                                  name="metadata-type"
                                  label="Collections"
                                  value="collections"
                                  checked={searchType === 'collections'}
                                  onChange={onSearchTypeChange}
                                />
                                <Form.Check
                                  id="search-type_variables"
                                  className="d-inline-flex align-items-center gap-2"
                                  inline
                                  type="radio"
                                  label="Variables"
                                  name="metadata-type"
                                  value="variables"
                                  checked={searchType === 'variables'}
                                  onChange={onSearchTypeChange}
                                />
                                <Form.Check
                                  id="search-type_services"
                                  className="d-inline-flex align-items-center gap-2"
                                  inline
                                  type="radio"
                                  label="Services"
                                  name="metadata-type"
                                  value="services"
                                  checked={searchType === 'services'}
                                  onChange={onSearchTypeChange}
                                />
                                <Form.Check
                                  id="search-type_tools"
                                  className="d-inline-flex align-items-center gap-2"
                                  inline
                                  type="radio"
                                  label="Tools"
                                  name="metadata-type"
                                  value="tools"
                                  checked={searchType === 'tools'}
                                  onChange={onSearchTypeChange}
                                />
                              </div>
                            </FormGroup>
                          </div>
                          <div>
                            <FormLabel className="d-block fw-bold mb-3">Select a provider</FormLabel>
                            {
                              providersLoading && (
                                <div className="d-flex align-items-center gap-2">
                                  <Spinner size="sm" />
                                  Loading available providers...
                                </div>
                              )
                            }
                            {
                              !providersLoading && providersError && (
                                <Alert className="d-flex align-items-center gap-2 mb-0" variant="danger">
                                  <FaExclamationCircle title="An exclamation point in a circle" />
                                  There was an error loading available providers
                                </Alert>
                              )
                            }
                            {
                              !providersLoading && !providersError && (
                                <FormSelect
                                  name="provider"
                                  size="sm"
                                  value={searchProvider}
                                  onChange={onSearchProviderChange}
                                >
                                  <option value="">Search all providers</option>
                                  {
                                    (!providersLoading && !providersError) && (
                                      <For each={orderBy(providersData.providers.items, ['providerId'], ['asc'])}>
                                        {
                                          ({ providerId, shortName }) => (
                                            <option
                                              key={shortName}
                                              value={providerId}
                                            >
                                              {providerId}
                                            </option>
                                          )
                                        }
                                      </For>
                                    )
                                  }
                                </FormSelect>
                              )
                            }
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
