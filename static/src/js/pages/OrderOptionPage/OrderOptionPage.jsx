import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { FaEdit } from 'react-icons/fa'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import OrderOption from '../../components/OrderOption/OrderOption'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

/**
 * Renders a OrderOptionPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionPageHeader</caption>
 * return (
 *   <OrderOptionPageHeader />
 * )
 */
const OrderOptionPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption = {} } = data
  const { name } = orderOption

  return (
    <PageHeader
      title={name}
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options'
          },
          {
            label: name,
            active: true
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [{
          icon: FaEdit,
          to: 'edit',
          title: 'Edit',
          iconTitle: 'A edit icon',
          variant: 'primary'
        }]
      }
    />
  )
}

/**
 * Renders a OrderOptionPage component
 *
 * @component
 * @example <caption>Render a OrderOptionPage</caption>
 * return (
 *   <OrderOptionPage />
 * )
 */
const OrderOptionPage = () => (
  <Page
    pageType="secondary"
    header={<OrderOptionPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <OrderOption />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionPage
