import React, { Suspense } from 'react'

import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import OrderOptionList from '@/js/components/OrderOptionList/OrderOptionList'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

/**
 * Renders a OrderOptionPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionPageHeader</caption>
 * return (
 *   <OrderOptionPageHeader />
 * )
 */
const OrderOptionListPageHeader = () => (
  <PageHeader
    breadcrumbs={
      [
        {
          label: 'Order Options',
          to: '/order-options'
        }
      ]
    }
    pageType="secondary"
    primaryActions={
      [{
        icon: FaPlus,
        iconTitle: 'A plus icon',
        title: 'New Order Option',
        to: 'new',
        variant: 'success'
      }]
    }
    title="Order Options"
  />
)

/**
 * Renders a OrderOptionListPage component
 *
 * @component
 * @example <caption>Render a OrderOptionListPage</caption>
 * return (
 *   <OrderOptionListPage />
 * )
 */
const OrderOptionListPage = () => (
  <Page
    pageType="secondary"
    header={<OrderOptionListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <OrderOptionList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionListPage
