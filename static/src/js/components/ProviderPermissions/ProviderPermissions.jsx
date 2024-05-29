import React, { useCallback, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormLabel from 'react-bootstrap/FormLabel'
import Row from 'react-bootstrap/Row'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import Select from 'react-select'

import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Table from '@/js/components/Table/Table'

import providerIdentityPermissions from '@/js/constants/providerIdentityPermissions'

import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

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

  const [providerPermissions, setProviderPermissions] = useState([])
  const [provider, setProvider] = useState()

  const { providerIds } = useAvailableProviders()

  const [
    getProviderIdentityPermissions,
    { loading }
  ] = useLazyQuery(GET_PROVIDER_IDENTITY_PERMISSIONS, {
    onCompleted: (data) => {
      const { acls } = data
      const { items } = acls

      const tableItems = Object.entries(providerIdentityPermissions).map((permission) => {
        const [key, value] = permission

        const { title } = value

        const acl = items
          .find((item) => (
            item.providerIdentity.target === key
            && item.providerIdentity.provider_id === provider
          ))

        const row = {
          target: key,
          title,
          permissions: []
        }

        if (acl) {
          const { groups = {} } = acl
          const { items: targetedAclGroups = [] } = groups

          const { permissions = [] } = targetedAclGroups.find((gp) => gp.id === id)

          return {
            ...row,
            permissions
          }
        }

        return row
      })

      setProviderPermissions(tableItems)
    }
  })

  const handleOnChange = (event) => {
    setProvider(event.value)
    getProviderIdentityPermissions({
      variables: {
        params: {
          identityType: 'provider',
          limit: 50,
          permittedGroup: id,
          provider: event.value
        }
      }
    })
  }

  const buildCheckboxCell = useCallback((cellData, rowData) => {
    const {
      target,
      permissions
    } = rowData

    const { [target]: targetedProvider = {} } = providerIdentityPermissions

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
  }, [providerPermissions])

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
          <FormLabel>Provider</FormLabel>
          <p className="text-muted">Select a provider that this group can take actions on behalf of.</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={8} lg={4} xl={3}>
          <Select
            className="mb-3"
            onChange={handleOnChange}
            options={
              providerIds.map((providerId) => ({
                label: providerId,
                value: providerId
              }))
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>

          {loading && <LoadingTable />}

          {
            (!loading && provider) && (
              <>
                <hr className="mb-3" />

                <Table
                  key={provider}
                  className="m-5"
                  columns={columns}
                  data={providerPermissions}
                  generateCellKey={({ target }, dataKey) => `column_${dataKey}_${target}`}
                  generateRowKey={({ target }) => `row_${target}`}
                  id={`${provider}-permissions-table`}
                  limit={Object.keys(providerIdentityPermissions).length}
                />
              </>
            )
          }
        </Col>
      </Row>
    </Container>
  )
}

export default ProviderPermissions
