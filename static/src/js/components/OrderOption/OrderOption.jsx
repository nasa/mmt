import React from 'react'
import moment from 'moment'

import { useSuspenseQuery } from '@apollo/client'

import { useParams } from 'react-router'
import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'
import { DATE_FORMAT } from '../../constants/dateFormat'

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
    deprecated,
    revisionDate
  } = orderOption

  return (
    <>
      <p className="text-muted">
        {`Last updated ${moment.utc(revisionDate).format(DATE_FORMAT)}`}
      </p>

      <p className="text-muted">
        {`Deprecated: ${deprecated ? 'True' : 'False'}`}
      </p>

      <p>{description}</p>

      <pre className="pre-scrollable">
        {form}
      </pre>
    </>
  )
}

export default OrderOption
