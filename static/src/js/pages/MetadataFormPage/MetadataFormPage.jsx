import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import MetadataForm from '@/js/components/MetadataForm/MetadataForm'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import getConceptTypeByDraftConceptId from '@/js/utils/getConceptTypeByDraftConceptId'
import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'
import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

/**
 * Renders a MetadataFormPageHeader component
 *
 * @component
 * @example <caption>Render a MetadataFormPageHeader</caption>
 * return (
 *   <MetadataFormPageHeader />
 * )
 */
const MetadataFormPageHeader = () => {
  const { conceptId = 'new', draftType } = useParams()

  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeStringMap[draftType]
  }

  const { data = {} } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft = {} } = data
  // Remove || {} in MMT-4070
  const { previewMetadata = {}, providerId } = draft || {}
  const { pageTitle } = previewMetadata

  const displayTitle = pageTitle || '<Blank Name>'

  const title = conceptId === 'new' ? `New ${derivedConceptType} Draft` : `Edit ${displayTitle}`

  return (
    <PageHeader
      title={title}
      titleBadge={providerId}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${draftType}`
          },
          (
            conceptId !== 'new' && {
              label: displayTitle,
              to: `/drafts/${draftType}/${conceptId}`
            }
          ),
          {
            label: title,
            active: true
          }
        ]
      }
    />
  )
}

/*
 * Renders a `MetadataFormPagePlaceholder` component.
 *
 * This component renders the metadata form page placeholder
 *
 * @param {MetadataFormPagePlaceholder} props
 *
 * @component
 * @example <caption>Render the metadata form page placeholder</caption>
 * return (
 *   <MetadataFormPagePlaceholder />
 * )
 */
const MetadataFormPagePlaceholder = () => (
  <Row>
    <Col className="" xs={8}>
      <Placeholder animation="glow" aria-hidden="true">
        <span className="d-block mb-4 w-100">
          <Placeholder className="w-25 d-block mb-5" style={{ height: '1.75rem' }} />
          <Placeholder className="w-50 d-block mb-3" size="lg" />
          <Placeholder className="w-100 d-block mb-2" size="sm" />
          <Placeholder className="w-100 d-block mb-2" size="sm" />
          <Placeholder className="w-25 d-block mb-4" size="sm" />
          <Placeholder className="w-100 d-block mb-5 rounded bg-light-dark" style={{ height: '3rem' }} />
          <Placeholder className="w-50 d-block mb-3" size="lg" />
          <Placeholder className="w-100 d-block mb-2" size="sm" />
          <Placeholder className="w-100 d-block mb-4" size="sm" />
          <Placeholder className="w-100 d-block mb-5 rounded bg-light-dark" style={{ height: '3rem' }} />
          <Placeholder className="w-50 d-block mb-4" />
          <Placeholder className="w-100 d-block mb-5 rounded bg-light-dark" style={{ height: '3rem' }} />
        </span>
      </Placeholder>
    </Col>
    <Col xs={4}>
      <Placeholder animation="glow" aria-hidden="true" className="d-block ps-lg-5 ps-md-3 pt-md-3">
        <span className="d-flex align-items-center w-100 mb-4">
          <Placeholder.Button className="btn-success me-4" style={{ width: '11rem' }} />
          <Placeholder className="d-block flex-grow-0" style={{ width: '5rem' }} size="sm" />
        </span>
        <span className="d-flex flex-column bg-light p-4 rounded" style={{ height: '20rem' }}>
          <Placeholder className="w-50 d-block mb-4" size="sm" />
          <Placeholder className="w-75 d-block mb-4" size="sm" />
          <Placeholder className="w-50 d-block mb-4" size="sm" />
          <Placeholder className="w-25 d-block mb-4" size="sm" />
          <Placeholder className="w-50 d-block mb-4" size="sm" />
          <Placeholder className="w-75 d-block mb-4" size="sm" />
        </span>
      </Placeholder>
    </Col>
  </Row>
)

/**
 * Renders a MetadataFormPage component
 *
 * @component
 * @example <caption>Render a MetadataFormPage</caption>
 * return (
 *   <MetadataFormPage />
 * )
 */
const MetadataFormPage = () => (
  <Page
    pageType="secondary"
    header={<MetadataFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<MetadataFormPagePlaceholder />}>
        <MetadataForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default MetadataFormPage
