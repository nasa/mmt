import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import getKmsConceptSchemes from '@/js/utils/getKmsConceptSchemes'

/**
 * KmsConceptSchemeSelector component
 *
 * This component renders a dropdown selector for KMS concept schemes.
 * It fetches the schemes based on the provided version and allows the user to select one.
 *
 * @param {Object} props - Component props
 * @param {string} props.version - The version of KMS to fetch schemes for
 * @param {function} props.onSchemeSelect - Callback function triggered when a scheme is selected
 */
const KmsConceptSchemeSelector = ({ version, defaultScheme, onSchemeSelect }) => {
  // State for storing the list of schemes
  const [schemes, setSchemes] = useState([])
  // State for storing the currently selected scheme
  const [selectedScheme, setSelectedScheme] = useState(null)
  // State for tracking loading status
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * Fetches the concept schemes for the given version
     */
    const fetchSchemes = async () => {
      if (!version) {
        // Reset states if no version is provided
        setSchemes([])
        setSelectedScheme(null)
        setLoading(false)
        onSchemeSelect(null)

        return
      }

      try {
        // Fetch schemes from the API
        const result = await getKmsConceptSchemes(version)
        // Transform the schemes into options for the dropdown
        const options = result.schemes.map((scheme) => ({
          value: scheme.name,
          label: scheme.name,
          updateDate: scheme.updateDate,
          csvHeaders: scheme.csvHeaders
        }))
        // Sort options alphabetically
        options.sort((a, b) => a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }))

        setSchemes(options)

        // Select the first option
        if (options.length > 0) {
          if (defaultScheme) {
            const matchingScheme = options.find((option) => option.value === defaultScheme?.name)
            if (matchingScheme) {
              setSelectedScheme(matchingScheme)
            }
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching schemes:', error)
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [version])

  /**
   * Handles the change event when a new scheme is selected
   * @param {Object} selectedOption - The selected scheme option
   */
  const handleChange = (selectedOption) => {
    setSelectedScheme(selectedOption)

    onSchemeSelect({
      name: selectedOption.value,
      longName: selectedOption.label,
      updateDate: selectedOption.updateDate,
      csvHeaders: selectedOption.csvHeaders
    })
  }

  return (
    <Select
      isLoading={loading}
      options={schemes}
      value={selectedScheme ?? defaultScheme}
      onChange={handleChange}
      placeholder="Select scheme..."
    />
  )
}

KmsConceptSchemeSelector.propTypes = {
  defaultScheme: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    type: PropTypes.string
  }),
  version: PropTypes.shape({
    version: PropTypes.string,
    version_type: PropTypes.string
  }),
  onSchemeSelect: PropTypes.func
}

KmsConceptSchemeSelector.defaultProps = {  
  defaultScheme: null,
  version: null,
  onSchemeSelect: () => {}
}

export default KmsConceptSchemeSelector
