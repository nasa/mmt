import React, { useCallback } from 'react'

import { Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useSuspenseQuery } from '@apollo/client'

import Table from '@/js/components/Table/Table'

import providerIdentityPermissions from '@/js/constants/providerIdentityPermissions'

import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'

/**
 * Renders a ProviderPermissions component
 *
 * @component
 * @example <caption>Render a ProviderPermissions</caption>
 * return (
 *   <ProviderPermissions />
 * )
 */
const ProviderPermissions = () => {
  const { id } = useParams()

  const { data } = useSuspenseQuery(GET_PROVIDER_IDENTITY_PERMISSIONS, {
    variables: {
      params: {
        identityType: 'provider',
        limit: 50
      }
    }
  })

  const { acls } = data
  const { items } = acls

  const tableItems = Object.entries(providerIdentityPermissions).map((permission) => {
    const [key, value] = permission

    const { title, permissions } = value

    return {
      key,
      title,
      permissions
    }
  })

  /**
   * Determine if a group has a permission for a target
   * @param {String} target The target identity of the Acl
   * @param {String} permission One of create, read, update or delete
   * @returns Whether or not the group has the permission
   */
  const checkAclPermission = (target, permission) => {
    const acl = items
      .filter((item) => item.groupPermissions.some((gp) => gp.group_id === id))
      .find((item) => item.providerIdentity.target === target)

    if (acl == null) {
      return false
    }

    const { groupPermissions = [] } = acl

    const { permissions = [] } = groupPermissions.find((gp) => gp.group_id === id)

    return permissions.includes(permission)
  }

  const buildCheckboxCell = useCallback((cellData, rowData) => {
    const {
      key,
      permissions
    } = rowData

    return (
      <input
        checked={checkAclPermission(key, cellData)}
        disabled={!permissions.includes(cellData)}
        name={`${key.toLowerCase()}_${cellData}`}
        onChange={() => {}}
        type="checkbox"
      />
    )
  }, [])

  const columns = [
    {
      dataKey: 'title',
      title: 'Title',
      className: 'col-auto'
    },
    {
      dataKey: 'create',
      title: 'Create',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: (cellData, rowData) => buildCheckboxCell('create', rowData)
    },
    {
      dataKey: 'read',
      title: 'Read',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: (cellData, rowData) => buildCheckboxCell('read', rowData)
    },
    {
      dataKey: 'update',
      title: 'Update',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: (cellData, rowData) => buildCheckboxCell('update', rowData)
    },
    {
      dataKey: 'delete',
      title: 'Delete',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: (cellData, rowData) => buildCheckboxCell('delete', rowData)
    }
  ]

  return (
    <Row>
      <Table
        className="m-5"
        columns={columns}
        data={tableItems}
        generateCellKey={({ key }, dataKey) => `column_${dataKey}_${key}`}
        generateRowKey={({ key }) => `row_${key}`}
        id="provider-permissions-table"
        limit={Object.keys(providerIdentityPermissions).length}
      />
    </Row>
  )
}

export default ProviderPermissions
