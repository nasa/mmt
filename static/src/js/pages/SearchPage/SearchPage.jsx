import React, {
  Suspense,
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'
import {
  capitalize,
  isNil,
  omitBy,
  orderBy
} from 'lodash-es'

import { FaSearch, FaExclamationCircle } from 'react-icons/fa'

import Alert from 'react-bootstrap/Alert'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownMenu from 'react-bootstrap/DropdownMenu'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import FormSelect from 'react-bootstrap/FormSelect'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'

import { useQuery } from '@apollo/client'
import { GET_PROVIDERS } from '@/js/operations/queries/getProviders'
import Button from '@/js/components/Button/Button'
import For from '@/js/components/For/For'
import getHumanizedNameFromTypeParam from '../../utils/getHumanizedNameFromTypeParam'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'
import SearchList from '../SearchList/SearchList'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { type: searchTypeFromPath } = useParams()
  const [searchProvider, setSearchProvider] = useState()
  // Set the input with the value from the keyword search param if one exists
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '')

  useEffect(() => {
    const currentSearchProvider = searchParams.get('provider')
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
      keyword: searchKeyword,
      provider: searchProvider
    }

    // Remove any null search params
    const prunedParams = omitBy(allParams, isNil)
    const params = new URLSearchParams(prunedParams)
    // Navigate to the search params with any of the defined params in the url
    navigate(`/${searchTypeFromPath}?${params.toString()}`)
  }

  // Callback for changing the provider select value
  const onSearchProviderChange = useCallback((e) => {
    setSearchProvider(e.target.value)
  }, [])

  return (
    <Form
      className="d-flex flex-row"
      onSubmit={
        (e) => {
          onSearchSubmit()
          e.preventDefault()
        }
      }
    >
      <FormGroup>
        <InputGroup>
          <FormLabel className="visually-hidden" htmlFor="search_mmt">
            Search
          </FormLabel>
          <FormControl
            id="search_mmt"
            style={
              {
                width: '16rem'
              }
            }
            className="rounded-start-1"
            type="text"
            placeholder="Enter a search term"
            value={searchKeyword}
            onChange={onSearchChange}
          />
          <Dropdown align="end" as={ButtonGroup}>
            <Button
              className="d-flex align-items-center"
              variant="primary"
              onClick={onSearchSubmit}
              type="submit"
            >
              <FaSearch className="me-2" />
              Search
            </Button>
            <Dropdown.Toggle
              split
              variant="primary"
              id="search-options-dropdown"
              aria-label="Search Options"
            />
            <DropdownMenu
              id="search-options-dropdown"
              className="bg-light-dark p-3 shadow"
            >
              <div style={{ width: '15rem ' }}>
                <FormLabel className="d-block mb-1 small">
                  Select a provider
                </FormLabel>
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
                    <Alert
                      className="d-flex align-items-center gap-2 mb-0"
                      variant="danger"
                    >
                      <FaExclamationCircle title="An exclamation point in a circle" />
                      There was an error loading available providers
                    </Alert>
                  )
                }
                {
                  !providersLoading && !providersError && (
                    <FormSelect
                      name="provider"
                      value={searchProvider}
                      onChange={onSearchProviderChange}
                    >
                      <option value="">Search all providers</option>
                      {
                        !providersLoading && !providersError && (
                          <For
                            each={
                              orderBy(
                                providersData.providers.items,
                                ['providerId'],
                                ['asc']
                              )
                            }
                          >
                            {
                              ({ providerId, shortName }) => (
                                <option key={shortName} value={providerId}>
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

/**
 * Renders a SearchPageHeader component
 *
 * @component
 * @example <caption>Render a SearchPageHeader</caption>
 * return (
 *   <SearchPageHeader />
 * )
 */

const renderSearchBar = () => {
  const { type: searchTypeFromPath } = useParams()
  // Don't render SearchBar for Visualizations
  if (searchTypeFromPath.toLowerCase() === 'visualizations') {
    return null
  }

  return <SearchBar />
}

const SearchPageHeader = () => {
  const { type: conceptType } = useParams()

  return (
    <PageHeader
      title={`All ${capitalize(getHumanizedNameFromTypeParam(conceptType))}s`}
      pageType="secondary"
      beforeActions={renderSearchBar()}
      beforeActions={renderSearchBar()}
      breadcrumbs={
        [
          {
            label: `${capitalize(getHumanizedNameFromTypeParam(conceptType))}s`,
            active: true
          }
        ]
      }
    />
  )
}

/**
 * Renders a `SearchPage` component
 *
 * @component
 * @example <caption>Renders a `SearchPage` component</caption>
 * return (
 *   <SearchPage />
 * )
 */
const SearchPage = () => (
  <Page pageType="secondary" header={<SearchPageHeader />}>
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <SearchList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default SearchPage
