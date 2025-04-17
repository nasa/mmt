import React, {
  Suspense,
  useState,
  useCallback,
  useEffect
} from 'react'
import { FaPlus } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'
import { getApplicationConfig } from 'sharedUtils/getConfig'

// Placeholder component for the keyword management tree. To be made into it's own file.
const KeywordManagementTree = () => (
  <div>Keyword Management Tree to be inserted here</div>
)

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
    // To be added to/amended
    primaryActions={
      [{
        icon: FaPlus,
        iconTitle: 'A plus icon',
        title: 'Publish New Keyword Version',
        to: 'new',
        variant: 'success'
      }]
    }
    title="Keyword Manager"
  />
)

const KeywordManagerPage = () => {
  const { showKeywordManager } = getApplicationConfig()
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showWarning, setShowWarning] = useState(false)

  if (showKeywordManager === 'false') {
    return null
  }

  const onVersionSelect = useCallback((versionInfo) => {
    setSelectedVersion(versionInfo)
  }, [])

  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
  }, [])

  useEffect(() => {
    console.log('selectedVersion=', selectedVersion)
    if (selectedVersion) {
      if (selectedVersion.version_type === 'published') {
        setShowWarning(true)
      }
      // Todo: add more logic here to handle the selected version: load scheme selector
    }
  }, [selectedVersion])

  useEffect(() => {
    if (selectedScheme) {
      console.log('selectedScheme=', selectedScheme)
      // Todo: add more logic here to handle the selected scheme
    }
  }, [selectedScheme])

  const handleCloseWarning = () => setShowWarning(false)

  return (
    <Page
      pageType="secondary"
      header={<KeywordManagerPageHeader />}
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingTable />}>
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
              <KmsConceptSchemeSelector version={selectedVersion} onSchemeSelect={onSchemeSelect} id="scheme-selector" />
            </div>
            <KeywordManagementTree />
          </div>
        </Suspense>
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

export default KeywordManagerPage
