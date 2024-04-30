import React, { Suspense } from 'react'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

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
            label: name,
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

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
      <Suspense fallback="Loading...">
        <OrderOptionForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionFormPage
