import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'
import validator from '@rjsf/validator-ajv8'

import camelcaseKeys from 'camelcase-keys'
import Page from '../Page/Page'
import useAppContext from '../../hooks/useAppContext'
import getTemplate from '../../utils/getTemplate'
import PreviewProgress from '../PreviewProgress/PreviewProgress'
import ummCTemplateSchema from '../../schemas/umm/ummCTemplateSchema'
import collectionsTemplateConfiguration from '../../schemas/uiForms/collectionTemplatesConfiguration.'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Button from '../Button/Button'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import errorLogger from '../../utils/errorLogger'
import delateTemplate from '../../utils/deleteTemplate'
import CustomModal from '../CustomModal/CustomModal'

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
  const { TemplateName: templateName } = ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, ummCTemplateSchema)

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  return (
    <Page
      title={templateName || '<Blank Name>'}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Collection Templates',
            to: '/templates/collections'
          },
          {
            label: templateName || '<Blank Name>',
            active: true
          }
        ]
      }
    >
      <Container id="template-form" className="px-0">
        <Row>
          <Col md={12} className="mb-3" />
        </Row>
        <Row>
          <Row>
            <Col className="mb-5" md={12}>
              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={
                    () => {
                      handleCreateCollectionDraft()
                    }
                  }
                >
                  Create Collection Draft
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={
                    () => {
                      toggleShowDeleteModal(true)
                    }
                  }
                >
                  Delete Template
                </Button>
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
              </div>
            </Col>
          </Row>
          <Col md={12}>
            <Row>
              <Col>
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
            <Col md={12}>
              <MetadataPreview
                previewMetadata={camelcaseKeys(ummMetadata, { deep: true })}
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
