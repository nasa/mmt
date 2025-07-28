import React, { Suspense, useState } from 'react'
import { useParams } from 'react-router'
import { FaPlus, FaFileUpload } from 'react-icons/fa'

import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'

import DraftList from '@/js/components/DraftList/DraftList'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import ummCSchema from '@/js/schemas/umm/ummCSchema'
import { JsonFileUploadModal } from '@/js/components/JsonFileUploadModal/JsonFileUploadModal'

/**
 * Renders a DraftPageHeader component
 *
 * @component
 * @example <caption>Render a DraftPageHeader</caption>
 * return (
 *   <DraftPageHeader />
 * )
 */
const DraftListPageHeader = () => {
  const { draftType } = useParams()
  const [showModal, setShowModal] = useState(false)

  const conceptType = urlValueTypeToConceptTypeStringMap[draftType]

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const showUploadModal = () => {
    setShowModal(true)
  }

  const saveDraft = (jsonData) => {
    console.log('saveDraft called with jsonData', jsonData)
  }

  const primaryActions = [
    {
      icon: FaPlus,
      iconTitle: 'A plus icon',
      title: 'New Draft',
      to: 'new',
      variant: 'primary'
    }
  ]

  // Add the 'Upload Draft' button only if conceptType is 'Collection'
  if (conceptType === 'Collection') {
    primaryActions.push({
      icon: FaFileUpload,
      iconTitle: 'A file upload icon',
      title: 'Upload Draft',
      onClick: showUploadModal,
      variant: 'secondary'
    })
  }

  return (
    <>
      <PageHeader
        title={`${conceptType} Drafts`}
        breadcrumbs={
          [
            {
              label: `${conceptType} Drafts`,
              to: `/drafts/${conceptType}s`,
              active: true
            }
          ]
        }
        pageType="secondary"
        primaryActions={primaryActions}
      />
      <JsonFileUploadModal
        show={showModal}
        toggleModal={toggleModal}
        schema={ummCSchema}
        saveDraft={saveDraft}
      />
    </>
  )
}

/**
 * Renders a DraftListPage component
 *
 * @component
 * @example <caption>Render a DraftListPage</caption>
 * return (
 *   <DraftListPage />
 * )
 */
const DraftListPage = () => (
  <Page
    pageType="secondary"
    header={<DraftListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <DraftList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default DraftListPage
