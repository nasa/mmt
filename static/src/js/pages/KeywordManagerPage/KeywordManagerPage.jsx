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
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types'

import { getApplicationConfig } from 'sharedUtils/getConfig'

import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import KeywordForm from '@/js/components/KeywordForm/KeywordForm'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import errorLogger from '@/js/utils/errorLogger'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'

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
  const [showError, setShowError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKeywordData, setSelectedKeywordData] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const { kmsHost } = getApplicationConfig()

  const handleShowKeyword = useCallback(async (uuid) => {
    setIsLoading(true)
    setShowError(null)
    try {
      const response = await fetch(`${kmsHost}/concept/${uuid}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rdfData = await response.text()
      const parsedData = createFormDataFromRdf(rdfData)
      setSelectedKeywordData(parsedData)
    } catch (error) {
      errorLogger(error, 'KeywordManagerPage: handleShowKeyword')
      setShowError(error.message)
      setSelectedKeywordData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
  }, [])

  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
  }, [])

  useEffect(() => {
    if (selectedVersion && selectedVersion.version_type === 'published') {
      setShowWarning(true)
    }
  }, [selectedVersion])

  useEffect(() => {
    if (selectedScheme) {
      // Todo: add more logic here to handle the selected version and scheme (showing the tree)
    }
  }, [selectedScheme])

  const handleCloseWarning = () => setShowWarning(false)

  const renderContent = () => {
    if (isLoading) {
      return <MetadataPreviewPlaceholder />
    }

    if (showError) {
      return <ErrorBanner message={showError} />
    }

    if (selectedKeywordData) {
      return <KeywordForm initialData={selectedKeywordData} />
    }

    return null
  }

  return (
    <Page
      pageType="secondary"
      header={<KeywordManagerPageHeader />}
    >
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <div className="me-4">
              <label
                htmlFor="version-selector"
                className="mb-2 d-block"
              >
                Version:
              </label>
              <KmsConceptVersionSelector onVersionSelect={onVersionSelect} id="version-selector" />
            </div>
            <div>
              <label
                htmlFor="scheme-selector"
                className="mb-2 d-block"
              >
                Scheme:
              </label>
              <KmsConceptSchemeSelector version={selectedVersion} onSchemeSelect={onSchemeSelect} id="scheme-selector" />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <ErrorBoundary>
          <Col md={5}>
            <KeywordManagementTree onShowKeyword={handleShowKeyword} />
          </Col>
        </ErrorBoundary>
        <ErrorBoundary>
          <Col md={7}>
            {renderContent()}
          </Col>
        </ErrorBoundary>
      </Row>
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
