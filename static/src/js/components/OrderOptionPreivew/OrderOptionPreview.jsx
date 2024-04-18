import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import moment from 'moment'

import Page from '../Page/Page'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import errorLogger from '../../utils/errorLogger'

import parseError from '../../utils/parseError'
import errorLogger from '../../utils/errorLogger'

import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

/**
 * Renders a OrderOptionPreview component
 *
 * @component
 * @example <caption>Render a OrderOptionPreview</caption>
 * return (
 *   <OrderOptionPreview />
 * )
 */
const OrderOptionPreview = () => {
  const { conceptId } = useParams()

  const [orderOption, setOrderOption] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const [getOrderOption] = useLazyQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getData) => {
      const { orderOption: retrievedOrderOption } = getData
      setOrderOption(retrievedOrderOption)
      setLoading(false)
    },
    onError: (getError) => {
      errorLogger('Unable to get Order Option', 'Order Option: getOrderOption')
      setError(getError)
      setLoading(false)
    }
  })

  useEffect(() => {
    setLoading(true)
    getOrderOption()
  }, [])

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

  const {
    deprecated,
    description,
    form,
    name,
    revisionDate,
    scope,
    sortKey
  } = orderOption || {}

  const orderOptionItems = (title, value) => (
    <div className="list-inline fs-5 pb-4">
      <span className="list-inline-item fw-bold text-muted text-decoration-underline">
        {title}
        :
      </span>
      <span className="list-inline-item">
        {' '}
        {value}
        {' '}
      </span>
    </div>
  )

  return (
    <Page
      className="pb-4"
      title={name}
      pageType="secondary"
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
    >
      {orderOptionItems('Description', description)}

      {orderOptionItems('Last Updated', moment(revisionDate).format('LLLL'))}

      {orderOptionItems('Scope', scope)}

      {orderOptionItems('Deprecated', deprecated ? 'true' : 'false')}

      {orderOptionItems('Sort Key', sortKey || '<Blank Sort Key>')}

      {orderOptionItems('Form XML', form)}
    </Page>
  )
}

export default OrderOptionPreview
