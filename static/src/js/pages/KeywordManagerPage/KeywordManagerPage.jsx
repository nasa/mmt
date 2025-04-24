import React, {
  Suspense,
  useState,
  useCallback,
  useEffect
} from 'react'
import { FaPlus } from 'react-icons/fa'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import PropTypes from 'prop-types'

import { getApplicationConfig } from 'sharedUtils/getConfig'

import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import KeywordForm from '@/js/components/KeywordForm/KeywordForm'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'
import KeywordTree from '@/js/components/KeywordTree/KeywordTree'

import errorLogger from '@/js/utils/errorLogger'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'

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

const TreePlaceholder = ({ message }) => (
  <div style={
    {
      width: '40%',
      maxWidth: '40%',
      height: '300px', // Adjust as needed
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: '4px'
    }
  }
  >
    {message}
  </div>
)

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

  const handleNodeDoubleClick = useCallback((nodeId) => {
    handleShowKeyword(nodeId)
  }, [handleShowKeyword])

  const fetchTreeData = async (version, scheme) => {
    if (version && scheme) {
      setIsTreeLoading(true)
      try {
        const data = await getKmsKeywordTree(version, scheme)
        setTreeData(data)
      } catch (error) {
        console.error('Error fetching keyword tree:', error)
        setTreeData(null)
      } finally {
        setIsTreeLoading(false)
      }
    }
  }

  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
    setSelectedScheme(null)
    setTreeData(null)
  }, [])

  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
    setTreeData(null)
  }, [])

  useEffect(() => {
    if (selectedVersion && selectedVersion.version_type === 'published') {
      setShowWarning(true)
    }
  }, [selectedVersion])

  useEffect(() => {
    if (selectedVersion && selectedScheme) {
      setTreeMessage('Loading...')
      fetchTreeData(selectedVersion, selectedScheme)
    } else {
      setTreeMessage('Select a version and scheme to load the tree')
    }
  }, [selectedVersion, selectedScheme])

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

  const renderTree = () => {
    if (isTreeLoading) {
      return <TreePlaceholder message="Loading tree..." />
    }

    if (treeData) {
      return (
        <KeywordTree
          key={`${selectedVersion?.version}-${selectedScheme?.name}`}
          data={treeData}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeEdit={handleShowKeyword}
        />
      )
    }

    return <TreePlaceholder message={treeMessage} />
  }

  return (
    <Page
      pageType="secondary"
      header={<KeywordManagerPageHeader />}
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingTable />}>

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
            <label
              htmlFor="scheme-selector"
              style={
                {
                  marginLeft: '20px',
                  marginRight: '10px',
                  marginBottom: '25px'
                }
              }
            >
              Scheme:
            </label>
            <div style={{ width: '300px' }}>
              <KmsConceptSchemeSelector
                version={selectedVersion}
                onSchemeSelect={onSchemeSelect}
                key={selectedVersion?.version}
                id="scheme-selector"
              />
            </div>
          </div>

        </Suspense>
      </ErrorBoundary>
      <div style={
        {
          display: 'flex',
          flexWrap: 'wrap'
        }
      }
      >
        <ErrorBoundary>
          <div style={
            {
              width: '40%',
              maxWidth: '40%',
              overflowX: 'auto',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              alignSelf: 'flex-start',
              maxHeight: '80vh',
              overflowY: 'auto'
            }
          }
          >
            {renderTree()}
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <div style={
            {
              flexBasis: '58.33%',
              maxWidth: '58.33%',
              padding: '0 15px 0 40px',
              minHeight: '300px'
            }
          }
          >
            {renderContent()}
          </div>
        </ErrorBoundary>
      </div>

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

TreePlaceholder.propTypes = {
  message: PropTypes.string.isRequired
}

export default KeywordManagerPage
