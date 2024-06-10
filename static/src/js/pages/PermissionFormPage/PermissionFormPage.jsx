import React, { Suspense } from 'react'
import { useSuspenseQuery } from '@apollo/client'

import { useParams } from 'react-router'

import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'
import PermissionForm from '../../components/PermissionForm/PermissionForm'

/**
 * Renders a PermissionFormPageHeader component
 *
 * @component
 * @example <caption>Render a PermissionFormPageHeader</caption>
 * return (
 *   <PermissionFormPageHeader />
 * )
 */
const PermissionFormPageHeader = () => {
  const { conceptId = 'new' } = useParams()

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    skip: conceptId === 'new',
    variables: {
      conceptId
    }
  })

  const { acl } = data || {}
  const { name } = acl || {}

  const pageTitle = conceptId === 'new' ? 'New Collection Permission' : `Edit ${name}`

  return (
    <PageHeader
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: 'Collection Permission',
            to: '/permissions'
          },
          (
            conceptId !== 'new' && {
              label: name,
              to: `/permissions/${conceptId}`
            }
          ),
          {
            label: pageTitle,
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/*
 * Renders a `PermissionFormPagePlaceholder` component.
 *
 * This component renders the metadata form page placeholder
 *
 * @param {PermissionFormPagePlaceholder} props
 *
 * @component
 * @example <caption>Render the metadata form page placeholder</caption>
 * return (
 *   <PermissionFormPagePlaceholder />
 * )
 */
const PermissionFormPagePlaceholder = () => (
  <Row>
    <Col xs={8}>
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
  </Row>
)

/**
 * Renders a PermissionFormPage component
 *
 * @component
 * @example <caption>Render a PermissionFormPage</caption>
 * return (
 *   <PermissionFormPage />
 * )
 */
const PermissionFormPage = () => (
  <Page
    pageType="secondary"
    header={<PermissionFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<PermissionFormPagePlaceholder />}>
        <PermissionForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default PermissionFormPage
