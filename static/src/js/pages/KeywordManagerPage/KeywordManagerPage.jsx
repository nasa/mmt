import React, {
  Suspense,
  useState,
  useCallback,
  useEffect
} from 'react'
import { FaPlus } from 'react-icons/fa'
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
import CustomModal from '@/js/components/CustomModal/CustomModal'

import errorLogger from '@/js/utils/errorLogger'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'

import './KeywordManagerPage.scss'

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
  <div className="keyword-manager-page__tree-placeholder">
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
        setTreeMessage('Failed to load the tree. Please try again.')
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

  const warningModalActions = [
    {
      label: 'OK',
      variant: 'primary',
      onClick: handleCloseWarning
    }
  ]

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
      return <TreePlaceholder message="Loading..." />
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
          <div className="keyword-manager-page__selector-container">
            <label
              htmlFor="version-selector"
              className="keyword-manager-page__selector-label"
            >
              Version:
            </label>
            <KmsConceptVersionSelector onVersionSelect={onVersionSelect} id="version-selector" />
            <label
              htmlFor="scheme-selector"
              className="keyword-manager-page__scheme-selector-label"
            >
              Scheme:
            </label>
            <div className="keyword-manager-page__scheme-selector-wrapper">
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
    </Page>
  )
}

TreePlaceholder.propTypes = {
  message: PropTypes.string.isRequired
}

export default KeywordManagerPage
