import React, { Suspense, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import { GET_GROUP } from '../../operations/queries/getGroup'

import AssociatedCollectionPermissionsTable from '../AssociatedCollectionPermissionsTable/AssociatedCollectionPermissionsTable'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import LoadingTable from '../LoadingTable/LoadingTable'
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
const Group = ({ isAdminPage }) => {
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

      {
        !isAdminPage && (
          <ErrorBoundary>
            <Suspense fallback={<LoadingTable />}>
              <AssociatedCollectionPermissionsTable />
            </Suspense>
          </ErrorBoundary>
        )
      }

    </>
  )
}

Group.defaultProps = {
  isAdminPage: false
}

Group.propTypes = {
  isAdminPage: PropTypes.bool
}

export default Group
