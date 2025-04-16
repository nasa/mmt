import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import getKmsConceptSchemes from '../../utils/getKmsConceptSchemes'

import './KmsConceptSchemeSelector.scss'

const KmsConceptSchemeSelector = ({ version, onSchemeSelect }) => {
  const [schemes, setSchemes] = useState([])
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!version) {
        setSchemes([])
        setLoading(false)

        return
      }

      try {
        const result = await getKmsConceptSchemes(version)
        const options = result.schemes.map((scheme) => ({
          value: scheme.name,
          label: scheme.longName,
          updateDate: scheme.updateDate,
          csvHeaders: scheme.csvHeaders
        }))

        options.sort((a, b) => a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }))

        setSchemes(options)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching schemes:', error)
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [version])

  const handleChange = (selectedOption) => {
    setSelectedScheme(selectedOption)
    if (selectedOption) {
      onSchemeSelect({
        name: selectedOption.value,
        longName: selectedOption.label,
        updateDate: selectedOption.updateDate,
        csvHeaders: selectedOption.csvHeaders
      })
    } else {
      onSchemeSelect(null)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Row className="mb-4">
      <Col>
        <div className="border rounded p-3">
          <h5 className="text-center mb-3">Select Concept Scheme</h5>
          <Form.Group>
            <Select
              isLoading={loading}
              options={schemes}
              value={selectedScheme}
              onChange={handleChange}
              placeholder="Select a concept scheme..."
              className="scheme-selector__select"
              isClearable
              isDisabled={!version}
            />
          </Form.Group>
          <div className="text-muted mt-2">
            {selectedScheme ? `Selected scheme: ${selectedScheme.label}` : 'No scheme selected'}
          </div>
        </div>
      </Col>
    </Row>
  )
}

KmsConceptSchemeSelector.propTypes = {
  version: PropTypes.string.isRequired,
  onSchemeSelect: PropTypes.func.isRequired
}

export default KmsConceptSchemeSelector
