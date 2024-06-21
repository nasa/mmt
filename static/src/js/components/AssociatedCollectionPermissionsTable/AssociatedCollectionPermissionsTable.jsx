import React, { useCallback } from 'react'

import { useParams } from 'react-router'

import { useSearchParams } from 'react-router-dom'

import { useSuspenseQuery } from '@apollo/client'

import { Col, Row } from 'react-bootstrap'

import { GET_GROUP_ACLS } from '@/js/operations/queries/getGroupAcls'

import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

/**
 * Renders a AssociatedCollectionPermissionTable component
 *
 * @component
 * @example <caption>Render a AssociatedCollectionPermissionTable</caption>
 * return (
 *   <AssociatedCollectionPermissionTable />
 * )
 */
const AssociatedCollectionPermissionsTable = () => {
  const { id } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const limit = 20
  const activePage = parseInt(searchParams.get('page'), 10) || 1

  const offset = (activePage - 1) * limit

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const { data } = useSuspenseQuery(GET_GROUP_ACLS, {
    skip: !id,
    variables: {
      params: {
        id
      },
      aclParams: {
        identityType: 'catalog_item',
        limit,
        offset
      }
    }
  })

  const { group } = data

  const { acls } = group

  const { items: associatedCollectionsItems, count } = acls

  const associatedCollectionsList = associatedCollectionsItems.map((item) => {
    const {
      catalogItemIdentity,
      conceptId,
      name

    } = item
    const { providerId } = catalogItemIdentity

    return {
      conceptId,
      name,
      providerId
    }
  })

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/permissions/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const associatedCollectionPermissionColumns = [
    {
      dataKey: 'name',
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell
    },
    {
      dataKey: 'providerId',
      title: 'Provider Id',
      className: 'col-auto'
    }
  ]

  return (
    <>
      <h5 className="mt-5">Associated Collection Permissions</h5>
      <ControlledPaginatedContent
        activePage={activePage}
        count={count}
        limit={limit}
        setPage={setPage}
      >
        {
          ({
            totalPages,
            pagination,
            firstResultPosition,
            lastResultPosition
          }) => {
            const paginationMessage = count > 0
              ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} collection permission`
              : 'No collection permission found'

            return (
              <>
                <Row className="d-flex justify-content-between align-items-center">
                  <Col className="mb-4 flex-grow-1" xs="auto">
                    {
                      (!!count) && (
                        <span className="text-secondary fw-bolder">{paginationMessage}</span>
                      )
                    }
                  </Col>
                  {
                    totalPages > 1 && (
                      <Col xs="auto">
                        {pagination}
                      </Col>
                    )
                  }
                </Row>
                <Table
                  columns={associatedCollectionPermissionColumns}
                  count={count}
                  data={associatedCollectionsList}
                  generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                  generateRowKey={({ conceptId }) => `row_${conceptId}`}
                  id="associated-collection-permission-table"
                  limit={10}
                  noDataMessage="No associated collection permissions found"
                  setPage={setPage}
                />

                {
                  totalPages > 1 && (
                    <Row>
                      <Col xs="12" className="pt-4 d-flex align-items-center justify-content-center">
                        <div>
                          {pagination}
                        </div>
                      </Col>
                    </Row>
                  )
                }
              </>
            )
          }
        }

      </ControlledPaginatedContent>
    </>
  )
}

export default AssociatedCollectionPermissionsTable
