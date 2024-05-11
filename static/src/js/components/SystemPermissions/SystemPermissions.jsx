import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { useParams } from 'react-router-dom'
import { useSuspenseQuery } from '@apollo/client'

import Table from '@/js/components/Table/Table'

import systemIdentityPermissions from '@/js/constants/systemIdentityPermissions'

import {
  GET_SYSTEM_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getSystemIdentityPermissions'

/**
 * Renders a SystemPermissions component
 *
 * @component
 * @example <caption>Render a SystemPermissions</caption>
 * return (
 *   <SystemPermissions />
 * )
 */
const SystemPermissions = () => {
  const { id } = useParams()

  const [systemPermissions, setSystemPermissions] = useState([])

  const { data } = useSuspenseQuery(GET_SYSTEM_IDENTITY_PERMISSIONS, {
    variables: {
      params: {
        identityType: 'system',
        limit: 50,
        permittedGroup: id
      }
    }
  })

  useEffect(() => {
    const { acls } = data
    const { items } = acls

    const tableItems = Object.entries(systemIdentityPermissions).map((permission) => {
      const [key, value] = permission

      const { title } = value

      const acl = items
        .find((item) => (item.systemIdentity.target === key))

      const row = {
        target: key,
        title,
        permissions: []
      }

      if (acl) {
        const { groupPermissions = [] } = acl

        const { permissions = [] } = groupPermissions.find((gp) => gp.group_id === id)

        return {
          ...row,
          permissions
        }
      }

      return row
    })

    setSystemPermissions(tableItems)
  }, [data])

  const buildCheckboxCell = useCallback((cellData, rowData) => {
    const {
      target,
      permissions
    } = rowData

    const { [target]: targetedProvider = {} } = systemIdentityPermissions

    const { permittedPermissions = [] } = targetedProvider

    return (
      <input
        checked={permissions.includes(cellData)}
        disabled={!permittedPermissions.includes(cellData)}
        name={`${target.toLowerCase()}_${cellData}`}
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
    <Container fluid className="px-0">
      <Row>
        <Col xs={12}>
          <Table
            key={`${id}-permissions-table`}
            className="m-5"
            columns={columns}
            data={systemPermissions}
            generateCellKey={({ target }, dataKey) => `column_${dataKey}_${target}`}
            generateRowKey={({ target }) => `row_${target}`}
            id={`${id}-permissions-table`}
            limit={Object.keys(systemIdentityPermissions).length}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default SystemPermissions
