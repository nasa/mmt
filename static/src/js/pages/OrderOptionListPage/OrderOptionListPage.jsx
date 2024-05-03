import React, { Suspense } from 'react'

import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import OrderOptionList from '../../components/OrderOptionList/OrderOptionList'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import useAppContext from '../../hooks/useAppContext'

/**
 * Renders a OrderOptionPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionPageHeader</caption>
 * return (
 *   <OrderOptionPageHeader />
 * )
 */
const OrderOptionListPageHeader = () => {
  const { user } = useAppContext()
  const { providerId } = user

  return (
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
      title={`${providerId} Order Options`}
    />
  )
}

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
