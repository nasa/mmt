import React, { Suspense } from 'react'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import OrderOptionForm from '../../components/OrderOptionForm/OrderOptionForm'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

/**
 * Renders a OrderOptionFormPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionFormPageHeader</caption>
 * return (
 *   <OrderOptionFormPageHeader />
 * )
 */
const OrderOptionFormPageHeader = () => {
  const { conceptId = 'new' } = useParams()

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption } = data || {}
  const { name } = orderOption || {}

  const pageTitle = conceptId === 'new' ? 'New Order Option' : `Edit ${name}`

  return (
    <PageHeader
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options'
          },
          (
            conceptId !== 'new' && {
              label: name,
              to: `/order-options/${conceptId}`
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
 * Renders a `OrderOptionFormPlaceholder` component.
 *
 * This component renders a order option form page placeholder
 *
 * @param {OrderOptionFormPlaceholder} props
 *
 * @component
 * @example <caption>Render the order option form page placeholder</caption>
 * return (
 *   <OrderOptionFormPlaceholder />
 * )
 */
const OrderOptionFormPlaceholder = () => (
  <>
    <Row>
      <Col>
        <Placeholder animation="glow" aria-hidden="true">
          <span className="d-block w-100 mt-2">
            <Placeholder className="w-25 d-block mb-2" size="sm" />
            <Placeholder className="w-100 d-block mb-4 rounded bg-light-dark" style={{ height: '2.25rem' }} />
          </span>
        </Placeholder>
      </Col>
      <Col>
        <Placeholder animation="glow" aria-hidden="true">
          <span className="d-block w-100 mt-2">
            <Placeholder className="w-25 d-block mb-2" size="sm" />
            <Placeholder className="w-100 d-block mb-4 rounded bg-light-dark" style={{ height: '2.25rem' }} />
          </span>
        </Placeholder>
      </Col>
    </Row>
    <Row>
      <Col>
        <Placeholder animation="glow" aria-hidden="true">
          <span className="d-block w-100 mt-2">
            <Placeholder className="w-25 d-block mb-2" size="sm" />
            <Placeholder className="w-100 d-block mb-4 rounded bg-light-dark" style={{ height: '6.25rem' }} />
          </span>
        </Placeholder>
      </Col>
    </Row>
    <Row>
      <Col>
        <Placeholder animation="glow" aria-hidden="true">
          <span className="d-block w-100 mt-2">
            <Placeholder className="w-25 d-block mb-2" size="sm" />
            <Placeholder className="w-100 d-block mb-5 rounded bg-light-dark" style={{ height: '6.25rem' }} />
          </span>
        </Placeholder>
      </Col>
    </Row>
    <Row>
      <Col>
        <Placeholder.Button className="btn-primary me-4" style={{ width: '11rem' }} />
        <Placeholder.Button className="btn-light-dark me-4" style={{ width: '11rem' }} />
      </Col>
    </Row>
  </>
)

/**
 * Renders a OrderOptionFormPage component
 *
 * @component
 * @example <caption>Render a OrderOptionFormPage</caption>
 * return (
 *   <OrderOptionFormPage />
 * )
 */
const OrderOptionFormPage = () => (
  <Page
    pageType="secondary"
    header={<OrderOptionFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<OrderOptionFormPlaceholder />}>
        <OrderOptionForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionFormPage
