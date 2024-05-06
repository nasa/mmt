import React, { useCallback } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import { GET_GROUP } from '../../operations/queries/getGroup'
import Table from '../Table/Table'

/**
 * Renders a Group component
 *
 * @component
 * @example <caption>Render a Group</caption>
 * return (
 *   <Group />
 * )
 */
const Group = () => {
  const { id } = useParams()

  const { data } = useSuspenseQuery(GET_GROUP, {
    skip: !id,
    variables: {
      params: {
        id
      }
    }
  })

  const { group } = data

  const {
    description,
    members
  } = group

  const { count, items } = members

  const buildName = useCallback((_cellData, rowData) => {
    const { firstName, lastName } = rowData

    return `${firstName} ${lastName}`
  }, [])

  const columns = [
    {
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildName
    },
    {
      dataKey: 'emailAddress',
      title: 'Email',
      className: 'col-auto'
    },
    {
      dataKey: 'id',
      title: 'Earthdata Login Username',
      className: 'col-auto'
    }
  ]

  return (
    <>
      <p>{description}</p>

      <p>Associated Collection Permissions - TBD</p>

      <p>Manage Provider Object Permissions - TBD</p>

      <Table
        id="member-table"
        columns={columns}
        generateCellKey={({ id: userId }, dataKey) => `column_${dataKey}_${userId}`}
        generateRowKey={({ id: userId }) => `row_${userId}`}
        data={items}
        noDataMessage="No members found"
        count={count}
        limit={count}
      />
    </>
  )
}

export default Group
