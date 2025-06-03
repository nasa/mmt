import React, {
  useState,
  useCallback,
  useEffect,
  useRef
} from 'react'
import {
  Col,
  Row,
  Form,
  Spinner
} from 'react-bootstrap'

import { FaPlus, FaFileCsv } from 'react-icons/fa'

import { getApplicationConfig } from 'sharedUtils/getConfig'

import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import KeywordForm from '@/js/components/KeywordForm/KeywordForm'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import { publishKmsConceptVersion } from '@/js/utils/publishKmsConceptVersion'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import { KeywordTree } from '@/js/components/KeywordTree/KeywordTree'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import GenerateKeywordReportModal from '@/js/components/GenerateKeywordReportModal/GenerateKeywordReportModal'
import {
  KeywordTreePlaceHolder
} from '@/js/components/KeywordTreePlaceHolder/KeywordTreePlaceHolder'

import errorLogger from '@/js/utils/errorLogger'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'
import useAuthContext from '@/js/hooks/useAuthContext'

import './KeywordManagerPage.scss'

/**
 * KeywordManagerPage Component
 *
 * This component represents the main page for managing keywords in a hierarchical structure.
 * It provides functionality to:
 * - Select and view different versions of keyword sets
 * - Choose specific keyword schemes within a version
 * - View and interact with a hierarchical keyword tree
 * - Add, edit, and manage individual keywords
 * - Publish new versions of keyword sets
 *
 * The page layout includes:
 * - Version and scheme selectors
 * - A keyword tree view
 * - A form for viewing and editing keyword details
 * - Modals for warnings and publishing new versions
 *
 * Key features:
 * - Integration with KMS (Knowledge Management System) for keyword data
 * - Real-time updates of the keyword tree upon modifications
 * - Version control and publishing capabilities
 * - Error handling and loading states
 *
 * @component
 *
 * @example
 * return (
 *   <KeywordManagerPage />
 * )
 */
const KeywordManagerPage = () => {
  const [showError, setShowError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKeywordData, setSelectedKeywordData] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const { kmsHost } = getApplicationConfig()
  const [selectedKeywordId, setSelectedKeywordId] = useState(null)

  const [showPublishModal, setShowPublishModal] = useState(false)
  const [newVersionName, setNewVersionName] = useState('')
  const [publishError, setPublishError] = useState(null)
  const [showKeywordForm, setShowKeywordForm] = useState(false)
  const [showPublishingModal, setShowPublishingModal] = useState(false)
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false)
  const [versionSelectorKey, setVersionSelectorKey] = useState(0)
  const { tokenValue, user } = useAuthContext()
  const { uid } = user || {}

  const keywordTreeRef = useRef(null)

  const handleKeywordSave = useCallback((savedKeywordId) => {
    if (keywordTreeRef.current) {
      keywordTreeRef.current.refreshTree()
    }

    setSelectedKeywordId(savedKeywordId)
  }, [])
  /**
   * Opens the modal for publishing a new keyword version.
   * Resets the new version name and clears any previous publish errors.
   */
  const handleOpenPublishModal = () => {
    setShowPublishModal(true)
    setNewVersionName('')
    setPublishError(null)
  }

  /**
   * Publishes a new keyword version.
   * If successful, closes the publish modal, shows a success message.
   * If unsuccessful, displays an error message.
   */
  const handlePublishVersion = async () => {
    setPublishError(null)
    try {
      setShowPublishingModal(true)
      await publishKmsConceptVersion(newVersionName, tokenValue)
      // Refresh the screen
      setVersionSelectorKey((prevKey) => prevKey + 1) // Force version selector to reload
      setSelectedVersion(null)
      setSelectedScheme(null)
      setSelectedKeywordData(null)
      setShowKeywordForm(false)
      setShowPublishModal(false) // Close the modal only on success
    } catch (error) {
      setPublishError('Error publishing new keyword version. Please try again in a few minutes.')
    } finally {
      setShowPublishingModal(false)
    }
  }

  /**
   * Fetches and sets the data for a selected keyword
   * @param {string} uuid - The unique identifier of the keyword
   */
  const handleShowKeyword = useCallback(async (uuid) => {
    setIsLoading(true)
    setShowError(null)
    try {
      let versionParam = selectedVersion.version
      if (selectedVersion.version_type === 'published') {
        versionParam = 'published'
      }

      const response = await fetch(`${kmsHost}/concept/${uuid}?version=${versionParam}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rdfData = await response.text()
      const parsedData = createFormDataFromRdf(rdfData)
      setSelectedKeywordData(parsedData)
      setShowKeywordForm(true)
    } catch (error) {
      errorLogger(error, 'KeywordManagerPage: handleShowKeyword')
      setShowError(error.message)
      setSelectedKeywordData(null)
      setShowKeywordForm(false)
    } finally {
      setIsLoading(false)
    }
  }, [selectedVersion])

  const handleAddNarrower = useCallback((parentId, newKeyword) => {
    // Create a new keyword data structure for the form
    const newKeywordData = {
      KeywordUUID: newKeyword.id,
      PreferredLabel: newKeyword.title,
      BroaderKeywords: [{ BroaderUUID: parentId }]
    }

    // Update the selected keyword data with the new keyword
    setSelectedKeywordData(newKeywordData)
    setShowKeywordForm(true)
  }, [])
  /**
   * Handles the click event on a tree node
   * @param {string} nodeId - The id of the clicked node
   */
  const handleNodeClick = useCallback((nodeId) => {
    handleShowKeyword(nodeId)
  }, [handleShowKeyword])

  /**
   * Handles the selection of a version
   * @param {object} versionInfo - The selected version information
   */
  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
    setSelectedScheme(null)
    setSelectedKeywordData(null)
    setShowKeywordForm(false)
  }, [])
  /**
   * Handles the selection of a scheme
   * @param {object} schemeInfo - The selected scheme information
   */
  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
    setSelectedKeywordData(null)
    setShowKeywordForm(false)
  }, [])
  // Effect to show warning when published version is selected
  useEffect(() => {
    if (selectedVersion && selectedVersion.version_type === 'published') {
      setShowWarning(true)
    }
  }, [selectedVersion])

  /**
   * Closes the warning modal
   */
  const handleCloseWarning = () => setShowWarning(false)
  // Modal actions for the warning modal
  const warningModalActions = [
    {
      label: 'OK',
      variant: 'primary',
      onClick: handleCloseWarning
    }
  ]

  const renderPublishStatus = () => {
    if (publishError) {
      return <div className="text-danger mt-2">{publishError}</div>
    }

    return null
  }

  /**
   * Renders the content based on the current state
   * @returns {JSX.Element} The rendered content
   */
  const renderContent = () => {
    if (isLoading) {
      return <MetadataPreviewPlaceholder />
    }

    if (showError) {
      return <ErrorBanner message={showError} />
    }

    if (showKeywordForm && selectedKeywordData) {
      return (
        <KeywordForm
          initialData={selectedKeywordData}
          version={selectedVersion}
          scheme={selectedScheme}
          onSave={handleKeywordSave}
          token={tokenValue}
          uid={uid}
        />
      )
    }

    return null
  }

  /**
   * Renders the keyword tree or a placeholder based on the current state
   * @returns {JSX.Element} The rendered tree or placeholder
   */
  const renderTree = () => (
    <KeywordTree
      ref={keywordTreeRef}
      key={`${selectedVersion?.version}-${selectedScheme?.name}`}
      onNodeClick={handleNodeClick}
      onNodeEdit={handleShowKeyword}
      onAddNarrower={handleAddNarrower}
      selectedNodeId={selectedKeywordId}
      selectedScheme={selectedScheme}
      selectedVersion={selectedVersion}
    />
  )

  return (
    <Page
      pageType="secondary"
      header={
        (
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
                  onClick: handleOpenPublishModal,
                  variant: 'primary'
                },
                {
                  icon: FaFileCsv,
                  iconTitle: 'A file csv icon',
                  title: 'Generate Report',
                  onClick: () => {
                    setShowGenerateReportModal(true)
                  },
                  variant: 'secondary'
                }
              ]
            }
            title="Keyword Manager"
          />
        )
      }
    >
      <ErrorBoundary>
        <div className="keyword-manager-page__selector-container">
          <label
            htmlFor="version-selector-label"
            className="keyword-manager-page__selector-label"
          >
            Version:
          </label>
          <Row className="mb-4">
            <Col>
              <div className="rounded p-3">
                <KmsConceptVersionSelector
                  onVersionSelect={onVersionSelect}
                  key={versionSelectorKey}
                />
              </div>
            </Col>
          </Row>
          <label
            htmlFor="scheme-selector"
            className="keyword-manager-page__scheme-selector-label"
          >
            Scheme:
          </label>
          <div className="keyword-manager-page__scheme-selector-wrapper">
            <Row className="mb-4">
              <Col>
                <div className="rounded p-3">
                  <KmsConceptSchemeSelector
                    version={selectedVersion}
                    onSchemeSelect={onSchemeSelect}
                    key={selectedVersion?.version}
                    id="scheme-selector"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </ErrorBoundary>
      <div className="keyword-manager-page__content">
        <ErrorBoundary>
          <div className="keyword-manager-page__tree-container">
            {renderTree()}
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="keyword-manager-page__form-container">
            {renderContent()}
          </div>
        </ErrorBoundary>
      </div>

      <CustomModal
        show={showWarning}
        toggleModal={() => setShowWarning(false)}
        header="Warning"
        message="You are now viewing the live published keyword version. Changes made to this version will show up on the website right away."
        actions={warningModalActions}
      />
      <CustomModal
        show={showPublishModal}
        toggleModal={() => setShowPublishModal(false)}
        header="Publish New Keyword Version"
        message={
          (
            <>
              <Form.Group>
                <Form.Label htmlFor="newKeywordVersion">Version Name:</Form.Label>
                <Form.Control
                  id="newKeywordVersion"
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="Enter version"
                />
              </Form.Group>
              {renderPublishStatus()}
            </>
          )
        }
        actions={
          [
            {
              label: 'Cancel',
              variant: 'secondary',
              onClick: () => setShowPublishModal(false)
            },
            {
              label: 'Publish',
              variant: 'primary',
              onClick: handlePublishVersion
            }
          ]
        }
      />
      <CustomModal
        show={showPublishingModal}
        header="Publishing New Version"
        showCloseButton={false}
        message={
          (
            <div className="text-center">
              <Spinner animation="border" role="status" className="mb-2" />
              <p>Publishing... Please wait.</p>
            </div>
          )
        }
        actions={[]}
      />
      {/* // TODO how does this work? */}
      <GenerateKeywordReportModal
        show={showGenerateReportModal}
        toggleModal={(state) => { setShowGenerateReportModal(state) }}
      />
    </Page>
  )
}

export default KeywordManagerPage
