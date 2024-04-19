import React from 'react'
import moment from 'moment'

import { useSuspenseQuery } from '@apollo/client'

import { useParams } from 'react-router'
import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

/**
 * Renders a OrderOption component
 *
 * @component
 * @example <caption>Render a OrderOption</caption>
 * return (
 *   <OrderOption />
 * )
 */
const OrderOption = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption } = data

  const {
    description,
    form,
    revisionDate
    // Name
  } = orderOption

  // UseEffect(() => {
  //   setPageTitle(name)
  // }, [name])

  // UseEffect(() => {
  //   const { revisionId: savedRevisionId } = savedDraft || {}
  //   if (
  //     (!orderOption && retries < 5)
  //     || (savedRevisionId && orderOption.revisionId !== savedRevisionId)) {
  //     refetch()
  //     setRetries(retries + 1)
  //   }

  //   if (retries >= 5) {
  //     errorLogger('Max retries allowed', 'OrderOptionPreview: getOrderOption Query')
  //     setError('Order Option could not be loaded.')
  //   }
  // }, [orderOption, retries])

  return (
    <>
      <p className="text-muted">
        {`Last updated ${moment(revisionDate).format('LLLL')}`}
      </p>

      <p>{description}</p>

      <pre className="pre-scrollable">
        {form}
      </pre>
    </>
  )
}

export default OrderOption
