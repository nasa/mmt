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

  const {
    ingestMutation,
    ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

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
