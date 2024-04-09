import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
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

const TemplatePreview = () => {
  const {
    draft = {},
    setDraft,
    user
  } = useAppContext()

  const { token, providerId } = user

  const { id } = useParams()

  // Const [error, setError] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    const fetchTemplates = async () => {
      const { response } = await getTemplate(providerId, token, id)

      delete response.pathParameters

      setDraft({
        ummMetadata: { ...response }
      })

      setLoading(false)
    }

    setLoading(true)
    fetchTemplates()
  }, [])

  console.log('draft', draft)

  const { ummMetadata = {} } = draft || {}
  const { TemplateName: templateName } = ummMetadata || {}
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, ummCTemplateSchema)

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  return (
    <Page
      title={`${templateName}` || '<Blank Name>'}
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
