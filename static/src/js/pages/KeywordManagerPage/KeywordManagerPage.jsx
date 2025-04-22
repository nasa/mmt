import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import { FaPlus } from 'react-icons/fa'
import {
  Row,
  Col,
  Button
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import Modal from 'react-bootstrap/Modal'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import KeywordForm from '@/js/components/KeywordForm/KeywordForm'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'

import parseRdfDataToInitialData from '@/js/utils/parseRdfDatatoInitialData'

import { getApplicationConfig } from 'sharedUtils/getConfig'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'

const KeywordManagementTree = ({ onShowKeyword }) => {
  // Needed until MMT-4003 can implement UUIDs
  const exampleUUID = '7545e1af-1a3a-4ebc-95e3-cbff49cca4c5'

  return (
    <div>
      <Button
        onClick={() => onShowKeyword(exampleUUID)}
        variant="primary"
      >
        Preview Keyword
      </Button>
    </div>
  )
}

const KeywordManagerPageHeader = () => (
  <PageHeader
    breadcrumbs={
      [
        {
          label: 'Keyword Manager',
          to: '/keywords',
          active: true
        }
      ]
    }
    pageType="secondary"
    primaryActions={
      [
        {
          icon: FaPlus,
          iconTitle: 'A plus icon',
          title: 'Publish New Keyword Version',
          to: 'new',
          variant: 'success'
        }
      ]
    }
    title="Keyword Manager"
  />
)

const KeywordManagerPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKeywordData, setSelectedKeywordData] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const { kmsHost } = getApplicationConfig()

  const handleShowKeyword = useCallback(async (uuid) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${kmsHost}/concept/${uuid}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rdfData = await response.text()
      const parsedData = parseRdfDataToInitialData(rdfData)
      setSelectedKeywordData(parsedData)
    } catch (error) {
      console.error('Error fetching keyword data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
  }, [])

  useEffect(() => {
    if (selectedVersion) {
      if (selectedVersion.version_type === 'published') {
        setShowWarning(true)
      }
      // Todo: add more logic here to handle the selected version: load scheme selector
    }
  }, [selectedVersion])

  const handleCloseWarning = () => setShowWarning(false)

  return (
    <Page
      pageType="secondary"
      header={<KeywordManagerPageHeader />}
    >
      <ErrorBoundary>
        <Row>
          <Col md={5}>
            <div>
              <div style={
                {
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }
              }
              >
                <label
                  htmlFor="version-selector"
                  style={
                    {
                      marginRight: '10px',
                      marginBottom: '25px'
                    }
                  }
                >
                  Version:
                </label>
                <KmsConceptVersionSelector onVersionSelect={onVersionSelect} id="version-selector" />
              </div>
              <KeywordManagementTree onShowKeyword={handleShowKeyword} />
            </div>
          </Col>
          <Col md={7}>
            {
              isLoading ? (
                <MetadataPreviewPlaceholder />
              ) : (
                selectedKeywordData && <KeywordForm initialData={selectedKeywordData} />
              )
            }
          </Col>
        </Row>
      </ErrorBoundary>

      <Modal show={showWarning} onHide={handleCloseWarning}>
        <Modal.Header>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are now viewing the live published keyword version. Changes made
          to this version will show up on the website right away.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseWarning}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Page>
  )
}

KeywordManagementTree.propTypes = {
  onShowKeyword: PropTypes.func.isRequired
}

export default KeywordManagerPage
