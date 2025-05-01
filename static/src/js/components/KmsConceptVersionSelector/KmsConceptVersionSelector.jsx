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
const KmsConceptVersionSelector = ({ onVersionSelect }) => {
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
        // Automatically select the draft version
        if (options.length > 0) {
          const draftVersion = options.find((option) => option.type === 'draft')
          if (draftVersion) {
            setSelectedVersion(draftVersion)
            onVersionSelect({
              version: draftVersion.value,
              version_type: draftVersion.type
            })
          }
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
      isLoading={loading}
      options={versions}
      value={selectedVersion}
      onChange={handleChange}
      placeholder="Loading versions..."
    />
  )
}

KmsConceptVersionSelector.propTypes = {
  onVersionSelect: PropTypes.func.isRequired
}

export default KmsConceptVersionSelector
