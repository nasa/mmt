import React, { Suspense, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FaPlus, FaFileUpload } from 'react-icons/fa'

import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'

import DraftList from '@/js/components/DraftList/DraftList'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import ummCSchema from '@/js/schemas/umm/ummCSchema'
import { JsonFileUploadModal } from '@/js/components/JsonFileUploadModal/JsonFileUploadModal'
import ChooseProviderModal from '@/js/components/ChooseProviderModal/ChooseProviderModal'
import saveTypes from '@/js/constants/saveTypes'
import useAppContext from '@/js/hooks/useAppContext'
import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'
import { useMutation } from '@apollo/client'
import errorLogger from '@/js/utils/errorLogger'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import getUmmVersion from '@/js/utils/getUmmVersion'
import removeEmpty from '@/js/utils/removeEmpty'

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
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [draftToSave, setDraftToSave] = useState(null)
  const { providerId } = useAppContext()
  const { addNotification } = useNotificationsContext()
  const navigate = useNavigate()

  const conceptType = urlValueTypeToConceptTypeStringMap[draftType]

  const [ingestDraftMutation] = useMutation(INGEST_DRAFT)

  const toggleFileUploadModal = () => {
    setShowFileUploadModal(!showFileUploadModal)
  }

  const upload = (jsonData) => {
    setDraftToSave(jsonData)
    setShowProviderModal(true)
  }

  const handleUpload = () => {
    ingestDraftMutation({
      variables: {
        conceptType,
        metadata: removeEmpty(draftToSave),
        nativeId: `MMT_${crypto.randomUUID()}`,
        providerId,
        ummVersion: getUmmVersion(conceptType)
      },
      onCompleted: (mutationData) => {
        const { ingestDraft } = mutationData
        const { conceptId: savedConceptId } = ingestDraft

        navigate(`/drafts/${draftType}/${savedConceptId}`)

        addNotification({
          message: 'Draft uploaded successfully',
          variant: 'success'
        })
      },
      onError: (ingestError) => {
        // Add an error notification
        addNotification({
          message: 'Error uploading draft',
          variant: 'danger'
        })

        // Send the error to the errorLogger
        errorLogger(ingestError, 'MetadataForm: ingestDraftMutation')
      }
    })

    setShowProviderModal(false)
    setDraftToSave(null)
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
      onClick: toggleFileUploadModal,
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
        show={showFileUploadModal}
        toggleModal={toggleFileUploadModal}
        schema={ummCSchema}
        upload={upload}
      />
      <ChooseProviderModal
        show={showProviderModal}
        toggleModal={() => setShowProviderModal(false)}
        type="draft"
        onSubmit={handleUpload}
        primaryActionType={saveTypes.submit}
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
