import React, {
  Suspense,
  useCallback,
  useEffect
} from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import PermissionCollectionTable from '@/js/components/PermissionCollectionTable/PermissionCollectionTable'
import Table from '@/js/components/Table/Table'
import validGroupItems from '@/js/utils/validGroupItems'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import './Permission.scss'

const Permission = () => {
  const { conceptId } = useParams()
  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()

  const { data = {} } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    variables: {
      conceptId
    }
  })

  useEffect(() => {
    if (data && conceptId !== 'new') {
      const { acl } = data
      if (!acl) {
        addNotification({
          message: `${conceptId} was not found.`,
          variant: 'danger'
        })

        navigate('/permissions')
      }
    }
  }, [data])

  const { acl } = data || {}

  const {
    catalogItemIdentity,
    collections,
    groups
  } = acl || {}

  // Returns valid group permission items. Invalid items are those without both id and userType.
  const groupItems = validGroupItems(groups?.items) || []

  const {
    collectionApplicable,
    collectionIdentifier,
    granuleApplicable,
    granuleIdentifier
  } = catalogItemIdentity || {}

  const {
    accessValue: collectionAccessValue,
    temporal
  } = collectionIdentifier || {}

  const { count: collectionCount, items: collectionItems } = collections || {}

  // Builds group list array with items for the table
  const groupList = groupItems.map(({
    id,
    name,
    permissions,
    userType
  }) => {
    let groupName = name
    if (userType === 'guest') {
      groupName = 'All Guest Users'
    }

    if (userType === 'registered') {
      groupName = 'All Registered Users'
    }

    return {
      name: groupName,
      id,
      search: permissions.includes('read'),
      order: permissions.includes('order')
    }
  })

  // Builds text for access constraints
  const buildAccessConstraintText = (accessValue) => {
    const {
      includeUndefinedValue,
      maxValue,
      minValue
    } = accessValue || {}

    const accessFragment = ['that have access constraint values']

    if (minValue && maxValue) {
      if (minValue === maxValue) {
        accessFragment.push(`equal to ${minValue}`)
      } else {
        accessFragment.push(`between ${minValue} and ${maxValue}`)
      }

      if (includeUndefinedValue) {
        accessFragment.push('(or are undefined)')
      }
    }

    return accessFragment.join(' ')
  }

  // Builds text for temporal constraints
  const buildTemporalText = (temporalObj) => {
    const {
      mask,
      startDate,
      stopDate
    } = temporalObj

    const temporalFragment = [' that have a start and end date']

    switch (mask) {
      case 'contains':
        temporalFragment.push('contained within')
        break
      case 'intersect':
        temporalFragment.push('having some overlap with')
        break
      case 'disjoint':
        temporalFragment.push('outside of')
        break
      default: break
    }

    temporalFragment.push(`the date range ${startDate} to ${stopDate}`)

    return temporalFragment.join(' ')
  }

  const buildAccessAndTemporalText = (accessValue, temporalObj) => {
    const sentenceFragments = []
    if (accessValue && temporalObj) {
      sentenceFragments.push(buildAccessConstraintText(accessValue), 'and', buildTemporalText(temporalObj))

      return sentenceFragments.join(' ')
    }

    if (accessValue) {
      sentenceFragments.push(buildAccessConstraintText(accessValue))
    }

    if (temporalObj) {
      sentenceFragments.push(buildTemporalText(temporalObj))
    }

    return sentenceFragments.join(' ')
  }

  const collectionConstraintSummary = () => {
    const sentenceFragments = ['This permission']

    if (collectionApplicable) {
      if (collectionCount) {
        sentenceFragments.push(`grants its assigned groups access to ${collectionCount} collection${collectionCount > 1 ? 's' : ''}`)
      } else {
        sentenceFragments.push('grants its assigned groups access to all of its collections')
      }

      sentenceFragments.push(buildAccessAndTemporalText(collectionAccessValue, temporal))
    } else {
      sentenceFragments.push('does not grant access to collections')
    }

    return sentenceFragments.join(' ')
  }

  const granuleConstraintSummary = () => {
    const {
      accessValue: granuleAccessValue,
      temporal: granuleTemporal = null
    } = granuleIdentifier || {}

    const sentenceFragments = ['This permission']

    if (granuleApplicable) {
      sentenceFragments.push('grants its assigned groups access to granules')

      sentenceFragments.push(buildAccessAndTemporalText(granuleAccessValue, granuleTemporal))

      if (collectionCount) {
        sentenceFragments.push(`that belong to the ${collectionCount} collection${collectionCount > 1 ? 's' : ''}`)
      } else {
        sentenceFragments.push('that belong to any of its collections')
      }

      sentenceFragments.push(buildAccessAndTemporalText(collectionAccessValue, temporal))
    } else {
      sentenceFragments.push('does not grant access to granules')
    }

    return sentenceFragments.join(' ')
  }

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    if (!id) {
      return cellData
    }

    return (
      <EllipsisLink to={`/groups/${id}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildCheckCell = useCallback((cellData, rowData) => {
    const { name: rowName } = rowData

    if (cellData) {
      return (
        <i
          aria-label={`${rowName} Passed`}
          className="eui-icon eui-check-o permission__pass-circle"
          role="img"
        />
      )
    }

    return null
  }, [])

  const columns = [
    {
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell,
      dataKey: 'name',
      title: 'Groups'
    },
    {
      align: 'center',
      className: 'col-auto',
      dataAccessorFn: buildCheckCell,
      dataKey: 'search',
      title: 'Search'
    },
    {
      align: 'center',
      className: 'col-auto',
      dataAccessorFn: buildCheckCell,
      dataKey: 'order',
      title: 'Order'
    }
  ]

  return (
    <Row>
      <Col className="mb-5" md={12}>
        <Table
          id="permission-table"
          columns={columns}
          generateCellKey={({ name }, dataKey) => `column_${dataKey}_${name}`}
          generateRowKey={({ name }) => `row_${name}`}
          data={groupList}
          noDataMessage="No permissions found"
          count={groupList.length}
          limit={20}
        />
      </Col>
      <Row className="m-2">
        <Col md={6}>
          <h5>Collections</h5>
          <span>
            {collectionConstraintSummary()}
          </span>
        </Col>

        <Col md={6}>
          <h5>Granules</h5>
          <span>
            {granuleConstraintSummary()}
          </span>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {
            collectionItems && (
              <ErrorBoundary>
                <Suspense fallback={<LoadingTable />}>
                  <PermissionCollectionTable />
                </Suspense>
              </ErrorBoundary>
            )
          }
        </Col>
      </Row>
    </Row>
  )
}

export default Permission
