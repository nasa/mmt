import React, { useState } from 'react'
import {
  Alert,
  Badge,
  Col,
  Row
} from 'react-bootstrap'

import { useSuspenseQuery } from '@apollo/client'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import { debounce } from 'lodash-es'
import useMMTCookie from '@/js/hooks/useMMTCookie'
import AsyncSelect from 'react-select/async'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

const GroupPermissionSelect = ({
  onChange, formData = {}

}) => {
  const { providerIds } = useAvailableProviders()

  const { apiHost } = getApplicationConfig()

  const { mmtJwt } = useMMTCookie()

  const [selectedOptions1, setSelectedOptions1] = useState([])
  const [selectedOptions2, setSelectedOptions2] = useState([])

  const { data: initialOptionsData } = useSuspenseQuery(GET_GROUPS, {
    skip: !providerIds,
    variables: {
      params: {
        tags: providerIds
      }
    }
  })

  const { groups } = initialOptionsData || {}

  const { items } = groups || {}

  const groupList = items?.map((item) => ({
    value: item.id,
    label: item.name,
    provider: item.tag
  }))

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

  const handleSelectChange1 = (selectedOptions) => {
    setSelectedOptions1(selectedOptions || [])
    onChange({
      ...formData,
      searchGroup: selectedOptions
    })
  }

  const handleSelectChange2 = (selectedOptions) => {
    setSelectedOptions2(selectedOptions || [])
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
      <Badge bg="primary" className="m-2">
        {provider}
      </Badge>
      {
        provider === 'CMR' && (
          <Badge bg="primary">
            System
          </Badge>
        )
      }
    </div>
  )

  // Loads the options from the search options endpoint. Uses `debounce` to avoid an API call for every keystroke
  const loadOptions = debounce((inputValue, callback) => {
    if (inputValue.length >= 3) {
      // Call the API to retrieve values
      fetch(`${apiHost}/groups?query=${inputValue}&tags=${providerIds.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mmtJwt}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          const options = data.map((item) => ({
            value: item.name,
            label: item.name,
            provider: item.tag
          }))

          // Use the callback function to set the values as select options
          callback(options)
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
      <Row className="">
        <Col>
          <CustomWidgetWrapper
            description="test"
            id="Search"
            label="Search"
            required
            title="Search"
          >
            <AsyncSelect
              isMulti
              value={selectedOptions1}
              onChange={handleSelectChange1}
              loadOptions={
                (inputValue, callback) => loadOptions(inputValue, (options) => {
                  callback(disableSelectedOptions(selectedOptions2)(options))
                })
              }
              defaultOptions={disableSelectedOptions(selectedOptions2)(initialOptions)}
              formatOptionLabel={formatOptionLabel}
            />
          </CustomWidgetWrapper>
        </Col>
        <Col>
          <CustomWidgetWrapper
            description="test"
            id="Search, Order, and S3 (If Available)"
            label="Search, Order, and S3 (If Available)"
            required
            title="Search, Order, and S3 (If Available)"
          >
            <AsyncSelect
              isMulti
              value={selectedOptions2}
              onChange={handleSelectChange2}
              loadOptions={
                (inputValue, callback) => loadOptions(inputValue, (options) => {
                  callback(disableSelectedOptions(selectedOptions1)(options))
                })
              }
              defaultOptions={disableSelectedOptions(selectedOptions1)(initialOptions)}
              formatOptionLabel={formatOptionLabel}
            />
          </CustomWidgetWrapper>
        </Col>
      </Row>
    </>
  )
}

export default GroupPermissionSelect
