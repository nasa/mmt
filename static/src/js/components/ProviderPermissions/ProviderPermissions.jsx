import React, { useCallback, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { isEqual } from 'lodash-es'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormLabel from 'react-bootstrap/FormLabel'
import Row from 'react-bootstrap/Row'
import Select from 'react-select'

import Button from '@/js/components/Button/Button'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Table from '@/js/components/Table/Table'

import providerIdentityPermissions from '@/js/constants/providerIdentityPermissions'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'
import generateCreateMutation from '@/js/operations/utils/generateCreateAclMutation'
import generateDeleteMutation from '@/js/operations/utils/generateDeleteAclMutation'
import generateUpdateMutation from '@/js/operations/utils/generateUpdateAclMutation'

import errorLogger from '@/js/utils/errorLogger'

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

  const { addNotification } = useNotificationsContext()

  // State to hold the provider permissions that exist in CMR, keyed by the target
  const [currentAcls, setCurrentAcls] = useState({})

  const [providerPermissionsForForm, setProviderPermissionsForForm] = useState([])
  const [provider, setProvider] = useState()

  const { providerIds } = useAvailableProviders()

  // CMR holds a single Acl entry for each provider target but doesnt offer a way to fetch
  // them all. Adding a limit of 50 will ensure we capture the 26 that exist today and
  // future proof the app for any new targets that may be added.
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
          // Track Acls that exist in CMR, key it by target for easier look up on submit
          setCurrentAcls((prev) => ({
            ...prev,
            [key]: acl
          }))

          const { groups } = acl
          const { items: aclGroups = [] } = groups

          const groupPermission = aclGroups.find((gp) => gp.id === id)

          // If a group permission exists for this group
          if (groupPermission) {
            const { permissions = [] } = groupPermission

            // Overwrite the permissions with the permissions from CMR
            return {
              ...row,
              permissions
            }
          }
        }

        return row
      })

      setProviderPermissionsForForm(tableItems)
    }
  })

  const [updateAcl, { loading: updateLoading }] = useMutation(UPDATE_ACL, {
    onError: (error) => {
      errorLogger('Failed to update provider permissions.', error)
    }
  })
  const [createAcl, { loading: createLoading }] = useMutation(CREATE_ACL, {
    onError: (error) => {
      errorLogger('Failed to create provider permissions.', error)
    }
  })
  const [deleteAcl, { loading: deleteLoading }] = useMutation(DELETE_ACL, {
    onError: (error) => {
      errorLogger('Failed to delete provider permissions.', error)
    }
  })

  const handleOnChangeProvider = (event) => {
    setProvider(event.value)
    getProviderIdentityPermissions({
      variables: {
        params: {
          identityType: 'provider',
          limit: 50,
          provider: event.value
        }
      }
    })
  }

  const handleOnChangeToggleAll = (event) => {
    const allPermissions = providerPermissionsForForm.map((permission) => {
      const { target } = permission

      // Get the permitted permissions from constant we store
      const { [target]: targetedAcl = {} } = providerIdentityPermissions

      const { permittedPermissions = [] } = targetedAcl

      // Override the form permissions values
      return {
        ...permission,
        permissions: event.target.checked ? permittedPermissions : []
      }
    })

    setProviderPermissionsForForm(allPermissions)
  }

  const handleOnChange = (event, cellData, rowData) => {
    const targetIndex = providerPermissionsForForm.findIndex(
      (item) => item.target === rowData.target
    )

    // If the checkbox is being checked add it, otherwise filter this value out
    const updatedRowData = {
      ...rowData,
      permissions: event.target.checked
        ? [...rowData.permissions, cellData]
        : rowData.permissions.filter((item) => item !== cellData)
    }

    // Create a copy of the provider permissions
    const overwrittenProviderPermissions = providerPermissionsForForm

    // Overwrite the row data with the updated row data
    overwrittenProviderPermissions[targetIndex] = updatedRowData

    // Update the state with the updated provider permissions
    setProviderPermissionsForForm([...overwrittenProviderPermissions])
  }

  const handleSubmit = async () => {
    const mutations = []

    providerPermissionsForForm.forEach((permission) => {
      const { target, permissions } = permission

      // Does an Acl with this target already exist in CMR?
      if (Object.keys(currentAcls).includes(target)) {
        const { [target]: targetedAcl } = currentAcls

        const { conceptId, groups = [] } = targetedAcl
        const { items: targetedAclGroups = [] } = groups

        const groupPermission = targetedAclGroups.find((gp) => gp.id === id)

        let currentPermissions = []

        // If the group has permissions for this target in CMR
        if (groupPermission) {
          // Get the current permissions in CMR
          ({
            permissions: currentPermissions = []
          } = groupPermission)

          // If the permissions in CMR don't match what was submitted
          if (!isEqual(currentPermissions, permissions)) {
            // If the form is being submitted with no permissions
            if (permissions.length === 0) {
              // If the Acl in CMR only has 1 group (this group) we can delete the Acl now
              if (targetedAclGroups.length === 1) {
                // Delete the Acl
                mutations.push(generateDeleteMutation(deleteAcl, conceptId))

                return
              }

              // Remove this group from the group permission
              mutations.push(
                generateUpdateMutation(
                  updateAcl,
                  conceptId,
                  targetedAclGroups.filter((gp) => gp.id !== id),
                  {
                    providerIdentity: {
                      target,
                      provider_id: provider
                    }
                  }
                )
              )

              return
            }

            // The permissions don't match CMR, update the group permission
            mutations.push(
              generateUpdateMutation(
                updateAcl,
                conceptId,
                [
                  ...targetedAclGroups.filter((gp) => gp.id !== id),
                  {
                    permissions,
                    id
                  }
                ],
                {
                  providerIdentity: {
                    target,
                    provider_id: provider
                  }
                }
              )
            )

            return
          }

          // The permissions match CMR
          return
        }

        // This group does not exist in the Acl for this target in CMR
        if (permissions.length > 0) {
          // Add this group to the group permission
          mutations.push(generateUpdateMutation(
            updateAcl,
            conceptId,
            [
              ...targetedAclGroups,
              {
                permissions,
                id
              }],
            {
              providerIdentity: {
                target,
                provider_id: provider
              }
            }
          ))

          return
        }
      }

      // This target does not have an Acl in CMR
      if (permissions.length > 0) {
        // Create a new Acl
        mutations.push(generateCreateMutation(
          createAcl,
          [{
            permissions,
            id
          }],
          {
            providerIdentity: {
              target,
              provider_id: provider
            }
          }
        ))
      }
    })

    const results = await Promise.allSettled(
      mutations.map(({ mutation, variables }) => mutation({ variables }))
    )

    // Supply a fetchPolicy here to prevent the cache from being used
    getProviderIdentityPermissions({
      variables: {
        params: {
          identityType: 'provider',
          limit: 50,
          provider
        }
      },
      fetchPolicy: 'network-only'
    })

    const totalMutations = results.length
    const successfulMutations = results.filter((result) => {
      const { value = {} } = result
      const { errors } = value

      return errors == null
    })
    const failedMutations = results.filter((result) => {
      const { value = {} } = result
      const { errors } = value

      return errors != null
    })

    if (totalMutations === successfulMutations.length) {
      addNotification({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    } else if (totalMutations === failedMutations.length) {
      addNotification({
        message: 'Failed to update provider permissions.',
        variant: 'danger'
      })
    } else {
      addNotification({
        message: 'Some permissions failed to update. Please check the form and try again.',
        variant: 'danger'
      })
    }
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
        aria-label={`${cellData} ${target.toLowerCase()}`}
        checked={permissions.includes(cellData)}
        disabled={!permittedPermissions.includes(cellData)}
        name={`${target.toLowerCase()}_${cellData}`}
        onChange={(event) => handleOnChange(event, cellData, rowData)}
        type="checkbox"
      />
    )
  }, [providerPermissionsForForm])

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
            onChange={handleOnChangeProvider}
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

                <div className="alert alert-light" role="alert">
                  <FormLabel className="m-0">
                    <input
                      aria-label="Check/Uncheck all permissions"
                      name="toggle-all"
                      onChange={handleOnChangeToggleAll}
                      type="checkbox"
                    />
                    {' Check/Uncheck all permissions'}
                  </FormLabel>
                </div>

                <Table
                  key={provider}
                  className="m-5"
                  columns={columns}
                  data={providerPermissionsForForm}
                  generateCellKey={({ target }, dataKey) => `column_${dataKey}_${target}`}
                  generateRowKey={({ target }) => `row_${target}`}
                  id={`${provider}-permissions-table`}
                  limit={Object.keys(providerIdentityPermissions).length}
                />

                <Button
                  loading={updateLoading || createLoading || deleteLoading}
                  loadingText="Saving..."
                  onClick={handleSubmit}
                  variant="primary"
                >
                  Submit
                </Button>

              </>
            )
          }
        </Col>
      </Row>
    </Container>
  )
}

export default ProviderPermissions
