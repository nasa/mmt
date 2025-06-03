import React, {
  Suspense,
  useEffect,
  useState
} from 'react'

import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import { debounce } from 'lodash-es'

import PropTypes from 'prop-types'

import { useLazyQuery, useSuspenseQuery } from '@apollo/client'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import AsyncSelect from 'react-select/async'

import {
  GET_GROUPS_FOR_PERMISSION_SELECT
} from '@/js/operations/queries/getGroupsForPermissionSelect'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

/*
 * Renders a `GroupPermissionSelectPlaceholder` component.
 *
 * This component renders the group permission form page placeholder
 *
 * @param {GroupPermissionSelectPlaceholder} props
 *
 * @component
 * @example <caption>Render the group permission form page placeholder</caption>
 * return (
 *   <GroupPermissionSelectPlaceholder />
 * )
 */
const GroupPermissionSelectPlaceholder = () => (
  <Row>
    <Col className="p-3">
      <div>
        <Placeholder animation="glow" aria-hidden="true">
          <div>
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
          </div>
        </Placeholder>
      </div>
    </Col>
  </Row>
)

/**
 * @typedef {Object} GroupPermissionSelectProps
 * @property {Function} onChange A callback function triggered when the user selects collections.
 * @property {Object} formData An Object with the saved metadata
 */
/**
 * Renders a GroupPermissionSelect component
 *
 * @component
 * @example <caption>Render a GroupPermissionSelect</caption>
 * return (
 *   <GroupPermissionSelect />
 * )
 */
const GroupPermissionSelect = ({
  onChange,
  formData
}) => (
  <ErrorBoundary>
    <Suspense fallback={<GroupPermissionSelectPlaceholder />}>
      <GroupPermissionSelectComponent onChange={onChange} formData={formData} />
    </Suspense>
  </ErrorBoundary>
)

GroupPermissionSelect.defaultProps = {
  formData: {}
}

GroupPermissionSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({})

}

/**
 * @typedef {Object} GroupPermissionSelectComponentProps
 * @property {Function} onChange A callback function triggered when the user selects collections.
 * @property {Object} formData An Object with the saved metadata
 */
/**
 * Renders a GroupPermissionSelectComponent component
 *
 * @component
 * @example <caption>Render a GroupPermissionSelectComponent</caption>
 * return (
 *   <GroupPermissionSelectComponent />
 * )
 */
const GroupPermissionSelectComponent = ({
  onChange,
  formData
}) => {
  const { providerIds } = useAvailableProviders()

  const [searchOptions, setSearchOptions] = useState([])
  const [searchAndOrderOptions, setSearchAndOrderOptions] = useState([])

  useEffect(() => {
    if (formData.searchAndOrderGroup) {
      setSearchAndOrderOptions(formData.searchAndOrderGroup)
    }

    if (formData.searchGroup) {
      setSearchOptions(formData.searchGroup)
    }
  }, [formData])

  const { data: initialOptionsData } = useSuspenseQuery(GET_GROUPS, {
    skip: providerIds.length === 0,
    variables: {
      params: {
        tags: providerIds,
        limit: 500
      }
    }
  })

  const { groups } = initialOptionsData || {}

  const { items } = groups || {}

  const groupList = items?.map((item) => ({
    value: item.id,
    label: item.name,
    provider: item.tag
  })).sort((a, b) => a.label.localeCompare(b.label))

  // Include "All RegisterUser" and "All Guest" in the initial options
  const additionalOptions = [
    {
      value: 'all-guest-user',
      label: 'All Guest User'
    },
    {
      value: 'all-registered-user',
      label: 'All Registered Users'
    }
  ]

  const initialOptions = groupList && groupList.length > 0
    ? [...additionalOptions, ...groupList]
    : additionalOptions

  const handleSearch = (selectedOptions) => {
    setSearchOptions(selectedOptions || [])
    onChange({
      ...formData,
      searchGroup: selectedOptions
    })
  }

  const handleSearchAndOrder = (selectedOptions) => {
    setSearchAndOrderOptions(selectedOptions || [])
    onChange({
      ...formData,
      searchAndOrderGroup: selectedOptions
    })
  }

  /**
   * Function to disable options that are already selected in another select component.
   *
   * @param {Array} selectedOptions - The currently selected options in one of the select components.
   * @returns {Function} - A function that takes the full list of options and returns the options with
   *                       the ones that are selected in the other component marked as disabled.
   */
  const disableSelectedOptions = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : []

    return (options) => options?.map((option) => ({
      ...option,
      isDisabled: selectedValues.includes(option.value)
    }))
  }

  /**
   * Function to format the label of each option in the select component.
   * Adds badges based on the provider of the option.
   *
   * @param {Object} option - The option object containing label and provider.
   * @param {string} option.label - The display label of the option.
   * @param {string} option.provider - The provider associated with the option.
   * @returns {JSX.Element} - A JSX element representing the formatted label.
   */
  const formatOptionLabel = ({ label, provider }) => (
    <div>
      {label}
      <Badge bg="primary" className="ms-2">
        {provider}
      </Badge>
      {
        provider === 'CMR' && (
          <Badge bg="primary" className="ms-1">
            SYSTEM
          </Badge>
        )
      }
    </div>
  )

  const [getGroups] = useLazyQuery(GET_GROUPS_FOR_PERMISSION_SELECT)

  // Loads the options from the search options endpoint. Uses `debounce` to avoid an API call for every keystroke
  const loadOptions = debounce((inputValue, callback) => {
    if (inputValue.length >= 3) {
      getGroups({
        variables: {
          params: {
            name: inputValue,
            limit: 20,
            tags: [providerIds.toString(), 'CMR']
          }
        },
        onCompleted: (data) => {
          const { groups: searchedGroups } = data

          const options = searchedGroups.items.map((item) => ({
            value: item.name,
            label: item.name,
            provider: item.tag
          }))
          callback(options)
        }
      })
    }
  }, 1000)

  return (
    <>
      <Row className="mt-2">
        <Col>
          <Alert>
            <div>
              <Badge>New</Badge>
              {' '}
              If one or more of your selected collections above have metadata that refer to
              Direct S3 Access, then the users in the
              {' '}
              <strong>
                Search, Order, and S3
              </strong>
              {' '}
              group below will be able to access the data associated with the collection via the
              AWS S3 API (if the user is in-region).
            </div>

            <div className="mt-3">
              Operators can enable Direct S3 Access for their collections via
              {' '}
              <u>
                UMM-C DirectDistributionInformation
              </u>
            </div>
          </Alert>
        </Col>
      </Row>
      <Row>
        <div>
          <h5>
            Group Permission
            <span>
              <i
                aria-label="Required"
                className="eui-icon eui-required-o text-success ps-2"
                role="img"
              />
            </span>
          </h5>

        </div>
        <Col
          style={
            {
              marginLeft: '10px',
              borderLeft: 'solid 5px rgb(240,240,240)',
              marginBottom: '20px'
            }
          }
        >
          <CustomWidgetWrapper
            description="List of permissions that has only read permission"
            id="Search"
            label="Search"
            required
            title="Search"
          >
            <AsyncSelect
              isMulti
              value={searchOptions}
              onChange={handleSearch}
              placeholder="Select groups for search"
              loadOptions={
                (inputValue, callback) => loadOptions(inputValue, (options) => {
                  callback(disableSelectedOptions(searchAndOrderOptions)(options))
                })
              }
              defaultOptions={disableSelectedOptions(searchAndOrderOptions)(initialOptions)}
              formatOptionLabel={formatOptionLabel}
            />
          </CustomWidgetWrapper>
        </Col>
        <Col>
          <CustomWidgetWrapper
            description="List of permissions that has read and order permission"
            id="Search, Order, and S3 (If Available)"
            label="Search, Order, and S3 (If Available)"
            required
            title="Search, Order, and S3 (If Available)"
          >
            <AsyncSelect
              isMulti
              value={searchAndOrderOptions}
              onChange={handleSearchAndOrder}
              placeholder="Select groups for search and order"
              loadOptions={
                (inputValue, callback) => loadOptions(inputValue, (options) => {
                  callback(disableSelectedOptions(searchOptions)(options))
                })
              }
              defaultOptions={disableSelectedOptions(searchOptions)(initialOptions)}
              formatOptionLabel={formatOptionLabel}
            />
          </CustomWidgetWrapper>
        </Col>
      </Row>
    </>
  )
}

GroupPermissionSelectComponent.defaultProps = {
  formData: {}
}

GroupPermissionSelectComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    searchAndOrderGroup: PropTypes.arrayOf(PropTypes.shape({})),
    searchGroup: PropTypes.arrayOf(PropTypes.shape({}))
  })
}

export default GroupPermissionSelect
