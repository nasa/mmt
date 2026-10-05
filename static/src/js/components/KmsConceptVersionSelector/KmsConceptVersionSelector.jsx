import PropTypes from 'prop-types'
import React from 'react'
import Select from 'react-select'

/**
 * KmsConceptVersionSelector component
 *
 * This component renders a controlled dropdown selector for KMS concept versions.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onVersionSelect - Callback function called when a version is selected
 */
const KmsConceptVersionSelector = ({
  isLoading,
  onVersionSelect,
  version,
  versions
}) => {
  const handleChange = (selectedOption) => {
    onVersionSelect({
      version: selectedOption.value,
      version_type: selectedOption.type
    })
  }

  return (
    <Select
      id="version-selector"
      isLoading={isLoading}
      options={versions}
      value={
        versions.find((option) => (
          option.value === version?.version && option.type === version?.version_type
        )) || null
      }
      onChange={handleChange}
      placeholder="Loading versions..."
    />
  )
}

KmsConceptVersionSelector.defaultProps = {
  isLoading: false,
  version: null
}

KmsConceptVersionSelector.propTypes = {
  isLoading: PropTypes.bool,
  versions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  version: PropTypes.shape({
    version: PropTypes.string,
    version_type: PropTypes.string
  }),
  onVersionSelect: PropTypes.func.isRequired
}

export default KmsConceptVersionSelector
