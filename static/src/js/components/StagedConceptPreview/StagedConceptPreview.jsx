import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import camelcaseKeys from 'camelcase-keys'
import { FaSave, FaTrash } from 'react-icons/fa'
import { CollectionPreview } from '@edsc/metadata-preview'
import { v4 as uuidv4 } from 'uuid'

import useAppContext from '@/js/hooks/useAppContext'
import useIngestDraftMutation from '@/js/hooks/useIngestDraftMutation'
import useMMTCookie from '@/js/hooks/useMMTCookie'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import saveTypes from '@/js/constants/saveTypes'

import ChooseProviderModal from '@/js/components/ChooseProviderModal/ChooseProviderModal'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import deleteStagedConcept from '@/js/utils/deleteStagedConcept'
import errorLogger from '@/js/utils/errorLogger'
import getStagedConcept from '@/js/utils/getStagedConcept'

import '@edsc/metadata-preview/dist/style.min.css'
import './StagedConceptPreview.scss'

// Staged concepts only support collections for now (see sharedConstants/s3ConceptTypes)
const STAGED_CONCEPT_TYPE = 'collections'

/**
 * Renders a StagedConceptPreview component
 *
 * @component
 * @example <caption>Render a StagedConceptPreview</caption>
 * return (
 *   <StagedConceptPreview />
 * )
 */
const StagedConceptPreview = () => {
  const { providerId } = useAppContext()
  const { mmtJwt } = useMMTCookie()

  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [metadata, setMetadata] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showProviderModal, setShowProviderModal] = useState(false)

  const {
    ingestMutation,
    ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  useEffect(() => {
    const fetchStagedConcept = async () => {
      try {
        const { concept } = await getStagedConcept(mmtJwt, STAGED_CONCEPT_TYPE, id)

        setMetadata(concept)
      } catch (fetchError) {
        errorLogger(fetchError, 'StagedConceptPreview: getStagedConcept')
        setError(fetchError)
      }

      setLoading(false)
    }

    setLoading(true)
    fetchStagedConcept()
  }, [id])

  const handleCreateDraft = () => {
    ingestMutation('Collection', metadata, `MMT_${uuidv4()}`, providerId)
  }

  const handleDelete = async () => {
    try {
      await deleteStagedConcept(mmtJwt, STAGED_CONCEPT_TYPE, id)

      addNotification({
        message: 'Staged metadata deleted successfully',
        variant: 'success'
      })

      navigate('/')
    } catch (deleteError) {
      addNotification({
        message: 'Error deleting staged metadata',
        variant: 'danger'
      })

      errorLogger(deleteError, 'StagedConceptPreview: deleteStagedConcept')
    }

    toggleShowDeleteModal(false)
  }

  useEffect(() => {
    if (ingestDraft) {
      const { ingestDraft: fetchedIngestDraft } = ingestDraft
      const { conceptId } = fetchedIngestDraft

      // Best-effort cleanup — the draft is already created, so don't block
      // navigation or bother the user if the staged record fails to delete
      deleteStagedConcept(mmtJwt, STAGED_CONCEPT_TYPE, id).catch((deleteError) => {
        errorLogger(deleteError, 'StagedConceptPreview: deleteStagedConcept')
      })

      navigate(`/drafts/collections/${conceptId}`)
      addNotification({
        message: 'Draft created successfully',
        variant: 'success'
      })
    }

    if (ingestDraftError) {
      const { message } = ingestDraftError
      errorLogger(ingestDraftError, 'StagedConceptPreview: ingestDraftMutation')
      addNotification({
        message: `Error creating draft: ${message}`,
        variant: 'danger'
      })
    }
  }, [ingestLoading])

  const { ShortName: pageTitle = '<Blank Name>' } = metadata || {}

  const pageHeader = (
    <PageHeader
      title={pageTitle}
      titleBadge="Staged"
      pageType="secondary"
      primaryActions={
        [
          {
            icon: FaSave,
            iconTitle: 'A save icon',
            onClick: () => setShowProviderModal(true),
            title: 'Save as New Draft',
            variant: 'success'
          },
          {
            icon: FaTrash,
            iconTitle: 'A trash can icon',
            onClick: () => toggleShowDeleteModal(true),
            title: 'Delete',
            variant: 'danger'
          }
        ]
      }
    />
  )

  if (loading) {
    return (
      <Page
        pageType="secondary"
        header={pageHeader}
      >
        <MetadataPreviewPlaceholder />
      </Page>
    )
  }

  if (error) {
    return (
      <ErrorBanner message={error.message} />
    )
  }

  return (
    <Page
      pageType="secondary"
      header={pageHeader}
    >
      <Container id="staged-concept-preview" className="px-0" fluid>
        <CustomModal
          message="Are you sure you want to delete this staged record? This cannot be undone."
          show={showDeleteModal}
          toggleModal={toggleShowDeleteModal}
          actions={
            [
              {
                label: 'No',
                variant: 'secondary',
                onClick: () => toggleShowDeleteModal(false)
              },
              {
                label: 'Yes',
                variant: 'primary',
                onClick: handleDelete
              }
            ]
          }
        />
        <ChooseProviderModal
          show={showProviderModal}
          toggleModal={() => setShowProviderModal(false)}
          type="draft"
          onSubmit={handleCreateDraft}
          primaryActionType={saveTypes.saveAndCreateDraft}
        />
        <Row>
          <Col md={12} className="staged-concept-preview__preview">
            <CollectionPreview
              collection={
                {
                  ...camelcaseKeys(metadata, { deep: true }),
                  title: metadata.EntryTitle
                }
              }
              conceptId={id}
              conceptType="Collection"
            />
          </Col>
        </Row>
      </Container>
    </Page>
  )
}

export default StagedConceptPreview
