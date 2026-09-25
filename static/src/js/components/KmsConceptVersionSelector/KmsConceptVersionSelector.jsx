import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import getKmsConceptVersions from '@/js/utils/getKmsConceptVersions'

/**
 * KmsConceptVersionSelector component
 *
 * This component renders a dropdown selector for KMS concept versions.
 * It fetches the available versions, sorts them, and allows the user to select a version.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onVersionSelect - Callback function called when a version is selected
 */
const KmsConceptVersionSelector = ({
  onVersionSelect,
  version: currentVersion,
  onDraftVersionLoaded
}) => {
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /**
     * Fetches KMS concept versions and prepares them for display
     */
    const fetchVersions = async () => {
      try {
        const result = await getKmsConceptVersions()
        const options = result.versions.map((version) => {
          // Map version types to display labels
          let type
          switch (version.type.toLowerCase()) {
            case 'draft':
              type = 'DRAFT-NEXT RELEASE'
              break
            case 'published':
              type = 'PRODUCTION'
              break
            case 'past_published':
              type = 'PAST PUBLISHED'
              break
            default:
              type = version.type
          }

          return {
            value: version.version,
            label: `${version.version} (${type})`,
            type: version.type.toLowerCase()
          }
        })

        // Sort the options based on version type
        const sortOrder = ['draft', 'published', 'past_published']
        options.sort((a, b) => sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type))

        setVersions(options)
        const draftOption = options.find((option) => option.type === 'draft')
        const draftVersion = draftOption ? {
          version: draftOption.value,
          version_type: draftOption.type
        } : null
        onDraftVersionLoaded(draftVersion)

        // Automatically select the draft version
        if (draftOption) {
          setSelectedVersion(draftOption)
          onVersionSelect(draftVersion)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching versions:', error)
        setLoading(false)
      }
    }

    fetchVersions()
  }, [])

  /**
   * Handles the selection of a version from the dropdown
   * @param {Object} selectedOption - The selected version option
   */
  const handleChange = (selectedOption) => {
    setSelectedVersion(selectedOption)
    onVersionSelect({
      version: selectedOption.value,
      version_type: selectedOption.type
    })
  }

  return (
    <Select
      id="version-selector"
      isLoading={loading}
      options={versions}
      value={
        currentVersion ? versions.find((option) => (
          option.value === currentVersion.version && option.type === currentVersion.version_type
        )) : selectedVersion
      }
      onChange={handleChange}
      placeholder="Loading versions..."
    />
  )
}

KmsConceptVersionSelector.defaultProps = {
  version: null,
  onDraftVersionLoaded: () => {}
}

KmsConceptVersionSelector.propTypes = {
  version: PropTypes.shape({
    version: PropTypes.string,
    version_type: PropTypes.string
  }),
  onDraftVersionLoaded: PropTypes.func,
  onVersionSelect: PropTypes.func.isRequired
}

export default KmsConceptVersionSelector
