import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import {
  Col,
  Row,
  Form,
  Spinner
} from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'

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
import {
  KeywordTreePlaceHolder
} from '@/js/components/KeywordTreePlaceHolder/KeywordTreePlaceHolder'

import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'
import errorLogger from '@/js/utils/errorLogger'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'
import useAuthContext from '@/js/hooks/useAuthContext'

import './KeywordManagerPage.scss'

/**
 * KeywordManagerPage Component
 *
 * This component represents the main page for managing keywords.
 * It allows users to select keyword versions and schemes, view and interact with a keyword tree,
 * and manage individual keywords.
 */
const KeywordManagerPage = () => {
  const [showError, setShowError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedKeywordData, setSelectedKeywordData] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [treeData, setTreeData] = useState(null)
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const { kmsHost } = getApplicationConfig()
  const [treeMessage, setTreeMessage] = useState('Select a version and scheme to load the tree')
  const [reloadTree, setReloadTree] = useState(false)
  const [selectedKeywordId, setSelectedKeywordId] = useState(null)

  const [showPublishModal, setShowPublishModal] = useState(false)
  const [newVersionName, setNewVersionName] = useState('')
  const [publishError, setPublishError] = useState(null)
  const [showKeywordForm, setShowKeywordForm] = useState(false)
  const [showPublishingModal, setShowPublishingModal] = useState(false)
  const [versionSelectorKey, setVersionSelectorKey] = useState(0)
  const { tokenValue, user } = useAuthContext()
  const { uid } = user || {}

  const handleKeywordSave = useCallback((savedKeywordId) => {
    setReloadTree((prev) => !prev)
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
      setTreeData(null)
      setSelectedKeywordData(null)
      setShowKeywordForm(false)
      setTreeMessage('Select a version and scheme to load the tree')
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
   * Fetches the keyword tree data based on the selected version and scheme
   * @param {object} version - The selected version object
   * @param {object} scheme - The selected scheme object
   */
  const fetchTreeData = async (version, scheme) => {
    if (version && scheme) {
      setIsTreeLoading(true)
      try {
        const data = await getKmsKeywordTree(version, scheme)
        setTreeData(data)
      } catch (error) {
        console.error('Error fetching keyword tree:', error)
        setTreeData(null)
        setTreeMessage('Failed to load the tree. Please try again.')
      } finally {
        setIsTreeLoading(false)
      }
    }
  }

  /**
   * Handles the selection of a version
   * @param {object} versionInfo - The selected version information
   */
  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
    setSelectedScheme(null)
    setTreeData(null)
    setSelectedKeywordData(null)
    setShowKeywordForm(false)
  }, [])
  /**
   * Handles the selection of a scheme
   * @param {object} schemeInfo - The selected scheme information
   */
  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
    setTreeData(null)
    setSelectedKeywordData(null)
    setShowKeywordForm(false)
  }, [])
  // Effect to show warning when published version is selected
  useEffect(() => {
    if (selectedVersion && selectedVersion.version_type === 'published') {
      setShowWarning(true)
    }
  }, [selectedVersion])

  // Effect to fetch tree data when version and scheme are selected
  useEffect(() => {
    if (selectedVersion && selectedScheme) {
      setTreeMessage('Loading...')
      fetchTreeData(selectedVersion, selectedScheme)
    } else {
      setTreeMessage('Select a version and scheme to load the tree')
    }
  }, [selectedVersion, selectedScheme, reloadTree])

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
  const renderTree = () => {
    if (isTreeLoading) {
      return <KeywordTreePlaceHolder message="Loading..." />
    }

    if (treeData) {
      return (
        <KeywordTree
          key={`${selectedVersion?.version}-${selectedScheme?.name}`}
          data={treeData}
          onNodeClick={handleNodeClick}
          onNodeEdit={handleShowKeyword}
          onAddNarrower={handleAddNarrower}
          selectedNodeId={selectedKeywordId}
        />
      )
    }

    return <KeywordTreePlaceHolder message={treeMessage} />
  }

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
                  variant: 'success'
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
                  id="version-selector"
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

    </Page>
  )
}

export default KeywordManagerPage
