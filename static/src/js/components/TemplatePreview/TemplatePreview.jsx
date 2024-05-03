import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { FaCopy, FaTrash } from 'react-icons/fa'

import { CollectionPreview } from '@edsc/metadata-preview'
import collectionsTemplateConfiguration from '../../schemas/uiForms/collectionTemplatesConfiguration.'
import ummCTemplateSchema from '../../schemas/umm/ummCTemplateSchema'

import CustomModal from '../CustomModal/CustomModal'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'
import PageHeader from '../PageHeader/PageHeader'
import PreviewProgress from '../PreviewProgress/PreviewProgress'

import delateTemplate from '../../utils/deleteTemplate'
import errorLogger from '../../utils/errorLogger'
import getTemplate from '../../utils/getTemplate'
import parseError from '../../utils/parseError'

import useAppContext from '../../hooks/useAppContext'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import DraftPreviewPlaceholder from '../DraftPreviewPlaceholder/DraftPreviewPlaceholder'
import MetadataPreviewPlaceholder from '../MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'

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
    setDraft,
    user
  } = useAppContext()
  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()
  const { id } = useParams()

  const { token, providerId } = user

  const [loading, setLoading] = useState()
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
    const fetchTemplates = async () => {
      const { response, error: fetchTemplateError } = await getTemplate(providerId, token, id)

      if (response) {
        delete response.pathParameters

        setDraft({
          ummMetadata: { ...response }
        })
      } else {
        setError(fetchTemplateError)
      }

      setLoading(false)
    }

    setLoading(true)
    fetchTemplates()
  }, [])

  const handleCreateCollectionDraft = () => {
    const { ummMetadata } = draft
    const nativeId = `MMT_${crypto.randomUUID()}`

    delete ummMetadata.TemplateName

    ingestMutation('Collection', ummMetadata, nativeId, providerId)
  }

  const handleDelete = async () => {
    const { response } = await delateTemplate(providerId, token, id)
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
      setLoading(false)
      errorLogger('Unable to Ingest Draft', 'Template Preview: ingestDraft Mutation')
      addNotification({
        message: 'Error removing collection association ',
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
