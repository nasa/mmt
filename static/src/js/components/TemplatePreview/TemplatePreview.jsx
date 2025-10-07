import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { FaCopy, FaTrash } from 'react-icons/fa'
import { CollectionPreview } from '@edsc/metadata-preview'
import { v4 as uuidv4 } from 'uuid'

import collectionsTemplateConfiguration from '@/js/schemas/uiForms/collectionTemplatesConfiguration'
import ummCTemplateSchema from '@/js/schemas/umm/ummCTemplateSchema'

import delateTemplate from '@/js/utils/deleteTemplate'
import errorLogger from '@/js/utils/errorLogger'
import getTemplate from '@/js/utils/getTemplate'
import parseError from '@/js/utils/parseError'

import useAppContext from '@/js/hooks/useAppContext'
import useIngestDraftMutation from '@/js/hooks/useIngestDraftMutation'
import useMMTCookie from '@/js/hooks/useMMTCookie'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import DraftPreviewPlaceholder from '@/js/components/DraftPreviewPlaceholder/DraftPreviewPlaceholder'
import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import PreviewProgress from '@/js/components/PreviewProgress/PreviewProgress'

import '@edsc/metadata-preview/dist/style.min.css'
import './TemplatePreview.scss'

/**
 * Renders a `TemplatePreviewPlaceholder` component
 *
 * @component
 * @example <caption>Renders a `TemplatePreviewPlaceholder` component</caption>
 * return (
 *   <TemplatePreviewPlaceholder />
 * )
 */
const TemplatePreviewPlaceholder = () => (
  <>
    <DraftPreviewPlaceholder />
    <MetadataPreviewPlaceholder />
  </>
)

/**
 * Renders a TemplatePreview component
 *
 * @component
 * @example <caption>Render a TemplatePreview</caption>
 * return (
 *   <TemplatePreview />
 * )
 */
const TemplatePreview = () => {
  const {
    draft = {},
    providerId,
    setDraft,
    setProviderId
  } = useAppContext()

  const { mmtJwt } = useMMTCookie()

  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    const fetchTemplate = async () => {
      const { response, error: fetchTemplateError } = await getTemplate(mmtJwt, id)
      if (response) {
        const { providerId: templateProviderId, template } = response

        setProviderId(templateProviderId)
        setDraft({
          ummMetadata: template
        })
      } else {
        setError(fetchTemplateError)
      }

      setLoading(false)
    }

    setLoading(true)
    fetchTemplate()
  }, [])

  const handleCreateCollectionDraft = () => {
    const { ummMetadata } = draft
    const nativeId = `MMT_${uuidv4()}`

    delete ummMetadata.TemplateName

    ingestMutation('Collection', ummMetadata, nativeId, providerId)
  }

  const handleDelete = async () => {
    const { response } = await delateTemplate(providerId, mmtJwt, id)
    if (response.ok) {
      addNotification({
        message: 'Template deleted successfully',
        variant: 'success'
      })

      toggleShowDeleteModal(false)
      navigate('/templates/collections')
    } else {
      addNotification({
        message: 'Error deleting template',
        variant: 'danger'
      })

      errorLogger('Error deleting template', 'TemplatePreview: deleteTemplate')

      toggleShowDeleteModal(false)
    }
  }

  useEffect(() => {
    if (ingestDraft) {
      const { ingestDraft: fetchedIngestDraft } = ingestDraft
      const { conceptId } = fetchedIngestDraft

      setLoading(false)
      navigate(`/drafts/collections/${conceptId}`)
      addNotification({
        message: 'Draft Created Successfully',
        variant: 'success'
      })
    }

    if (ingestDraftError) {
      const { message } = ingestDraftError
      setLoading(false)
      errorLogger(ingestDraftError, 'TemplatePreview: ingestDraft Mutation')
      addNotification({
        message: `Error creating draft: ${message}`,
        variant: 'danger'
      })
    }
  }, [ingestLoading])

  const { ummMetadata = {} } = draft
  const { TemplateName: templateName = '<Blank Name>' } = ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, ummCTemplateSchema)

  const templatePreviewPageHeader = () => (
    <PageHeader
      title={templateName}
      titleBadge={providerId}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Collection Templates',
            to: '/templates/collections'
          },
          {
            label: templateName,
            active: true
          }
        ]
      }
      primaryActions={
        [
          {
            icon: FaCopy,
            iconTitle: 'A copy/paste icon',
            onClick: handleCreateCollectionDraft,
            title: 'Create Draft',
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

  const pageHeader = templatePreviewPageHeader()
  if (loading) {
    return (
      <Page
        pageType="secondary"
        header={pageHeader}
      >
        <TemplatePreviewPlaceholder />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <ErrorBanner message={message} />
    )
  }

  return (
    <Page
      pageType="secondary"
      header={pageHeader}
    >
      <Container id="template-form" className="px-0" fluid>
        <Row>
          <CustomModal
            message="Are you sure you want to delete this template?"
            show={showDeleteModal}
            toggleModal={toggleShowDeleteModal}
            actions={
              [
                {
                  label: 'No',
                  variant: 'secondary',
                  onClick: () => { toggleShowDeleteModal(false) }
                },
                {
                  label: 'Yes',
                  variant: 'primary',
                  onClick: handleDelete
                }
              ]
            }
          />
          <Col md={12}>
            <Row>
              <Col className="mb-5">
                <h3 className="sr-only">Metadata Fields</h3>
                <PreviewProgress
                  draftJson={ummMetadata}
                  schema={ummCTemplateSchema}
                  sections={collectionsTemplateConfiguration}
                  validationErrors={validationErrors}
                />
              </Col>
            </Row>
          </Col>
          <Row>
            <Col md={12} className="template-preview__preview">
              <h2 className="fw-bold fs-4">Preview</h2>
              <CollectionPreview
                collection={camelcaseKeys(ummMetadata, { deep: true })}
                conceptId={id}
                conceptType="Collection"
              />
            </Col>
          </Row>
        </Row>
      </Container>
    </Page>
  )
}

export default TemplatePreview
