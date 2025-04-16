import React, { Suspense, useState } from 'react'
import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
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

  if (showKeywordManager === 'false') {
    return null
  }

  const onVersionSelect = (versionInfo) => {
    setSelectedVersion(versionInfo)
    console.log('Selected version:', selectedVersion)
    // Todo: add more logic here to handle the selected version
  }

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
              <label htmlFor="version-selector" style={{ marginRight: '10px' }}>Version:</label>
              <KmsConceptVersionSelector onVersionSelect={onVersionSelect} id="version-selector" />
            </div>
            {selectedVersion && <KeywordManagementTree />}
          </div>
          <KeywordManagementTree />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

export default KeywordManagerPage
