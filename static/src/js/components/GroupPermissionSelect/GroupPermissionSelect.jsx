import React, { useState } from 'react'
import {
  Alert,
  Badge,
  Col,
  Row
} from 'react-bootstrap'
import Select from 'react-select'

import { useSuspenseQuery } from '@apollo/client'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'

const GroupPermissionSelect = () => {
  const groupVariables = {
    params: {
      tags: ['MMT_2', 'CMR'],
      limit: 200
    }
  }

  const { data } = useSuspenseQuery(GET_GROUPS, {
    variables: groupVariables
  })

  const { groups } = data

  const { items } = groups

  const options = items.map((item) => ({
    value: item.name,
    label: item.name,
    provider: item.tag
  }))

  const [selectedOptions1, setSelectedOptions1] = useState([])
  const [selectedOptions2, setSelectedOptions2] = useState([])

  const handleSelectChange1 = (selectedOptions) => {
    setSelectedOptions1(selectedOptions || [])
  }

  const handleSelectChange2 = (selectedOptions) => {
    setSelectedOptions2(selectedOptions || [])
  }

  const disableSelectedOptions = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : []

    return options.map((option) => ({
      ...option,
      isDisabled: selectedValues.includes(option.value)
    }))
  }

  const formatOptionLabel = ({ value, label, provider }) => (
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
      <Row className="mb-5">
        <Col>
          <Select
            isMulti
            value={selectedOptions1}
            onChange={handleSelectChange1}
            options={disableSelectedOptions(selectedOptions2)}
            isClearable
            formatOptionLabel={formatOptionLabel}

          />
          <div>
            {
              selectedOptions1.map((option) => (
                <Badge key={option.value} pill bg="primary" className="m-1">
                  {option.label}
                </Badge>
              ))
            }
          </div>
        </Col>
        <Col>
          <Select
            isMulti
            value={selectedOptions2}
            onChange={handleSelectChange2}
            options={disableSelectedOptions(selectedOptions1)}
            isClearable
            formatOptionLabel={formatOptionLabel}
          />
        </Col>
      </Row>
    </>
  )
}

export default GroupPermissionSelect
