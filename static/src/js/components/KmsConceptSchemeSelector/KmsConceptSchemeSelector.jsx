import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import getKmsConceptSchemes from '@/js/utils/getKmsConceptSchemes'

const KmsConceptSchemeSelector = ({ version, onSchemeSelect }) => {
  const [schemes, setSchemes] = useState([])
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!version) {
        setSchemes([])
        setSelectedScheme(null)
        setLoading(false)
        onSchemeSelect(null)

        return
      }

      try {
        const result = await getKmsConceptSchemes(version)
        const options = result.schemes.map((scheme) => ({
          value: scheme.name,
          label: scheme.name,
          updateDate: scheme.updateDate,
          csvHeaders: scheme.csvHeaders
        }))

        options.sort((a, b) => a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }))

        setSchemes(options)

        // Select the first option
        if (options.length > 0) {
          const firstOption = options[0]
          setSelectedScheme(firstOption)
          onSchemeSelect({
            name: firstOption.value,
            longName: firstOption.label,
            updateDate: firstOption.updateDate,
            csvHeaders: firstOption.csvHeaders
          })
        }

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
    }
  }

  return (
    <Row className="mb-4">
      <Col>
        <div className="rounded p-3">
          <Select
            isLoading={loading}
            options={schemes}
            value={selectedScheme}
            onChange={handleChange}
            placeholder="Loading schemes..."
          />
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
