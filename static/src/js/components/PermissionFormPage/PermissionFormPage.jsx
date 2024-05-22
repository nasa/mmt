import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'
import { useSuspenseQuery } from '@apollo/client'
import React, { Suspense } from 'react'
import { useParams } from 'react-router'
import {
  Col,
  Placeholder,
  Row
} from 'react-bootstrap'
import PageHeader from '../PageHeader/PageHeader'
import Page from '../Page/Page'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PermissionForm from '../PermissionForm/PermissionForm'

const PermissionFormPageHeader = () => {
  const { conceptId = 'new' } = useParams()

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption } = data || {}
  const { name } = orderOption || {}

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
const PermissionFormPage = () => {
  console.log('yo this is a new page')

  return (
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
}

export default PermissionFormPage
