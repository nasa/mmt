import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import getKmsConceptVersions from '../../utils/getKmsConceptVersions'

const KmsConceptVersionSelector = ({ onVersionSelect }) => {
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialSelectionMade, setInitialSelectionMade] = useState(false)

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const result = await getKmsConceptVersions()
        const options = result.versions.map((version) => {
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

        // Sort the options
        const sortOrder = ['draft', 'published', 'past_published']
        options.sort((a, b) => sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type))

        setVersions(options)
        // Select the draft version if it exists and no selection has been made
        if (!initialSelectionMade) {
          const draftVersion = options.find((option) => option.value === 'draft')
          if (draftVersion) {
            setSelectedVersion(draftVersion)
            onVersionSelect({
              version: draftVersion.value,
              version_type: draftVersion.type
            })

            setInitialSelectionMade(true)
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

  const handleChange = (selectedOption) => {
    setSelectedVersion(selectedOption)
    onVersionSelect({
      version: selectedOption.value,
      version_type: selectedOption.type
    })
  }

  return (
    <Row className="mb-4">
      <Col>
        <div className="rounded p-3">
          <Select
            isLoading={loading}
            options={versions}
            value={selectedVersion}
            onChange={handleChange}
            placeholder="Loading versions..."
          />
        </div>
      </Col>
    </Row>
  )
}

KmsConceptVersionSelector.propTypes = {
  onVersionSelect: PropTypes.func.isRequired
}

export default KmsConceptVersionSelector
