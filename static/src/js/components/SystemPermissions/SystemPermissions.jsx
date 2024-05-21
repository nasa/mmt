import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormLabel from 'react-bootstrap/FormLabel'
import Row from 'react-bootstrap/Row'

import { isEqual } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useMutation, useSuspenseQuery } from '@apollo/client'

import Button from '@/js/components/Button/Button'
import Table from '@/js/components/Table/Table'

import systemIdentityPermissions from '@/js/constants/systemIdentityPermissions'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import {
  GET_SYSTEM_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getSystemIdentityPermissions'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

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

  const { addNotification } = useNotificationsContext()

  // State to hold the system permissions that exist in CMR, keyed by the target
  const [currentAcls, setCurrentAcls] = useState({})

  // State to hold the system permissions for the form
  const [systemPermissionsForForm, setSystemPermissionsForForm] = useState([])

  // CMR holds a single Acl entry for each system target but doesnt offer a way to fetch
  // them all. Adding a limit of 50 will ensure we capture the 26 that exist today and
  // future proof the app for any new targets that may be added.
  const { data, refetch } = useSuspenseQuery(GET_SYSTEM_IDENTITY_PERMISSIONS, {
    variables: {
      params: {
        identityType: 'system',
        limit: 50
      }
    }
  })

  const [updateAcl, { loading: updateLoading }] = useMutation(UPDATE_ACL)
  const [createAcl, { loading: createLoading }] = useMutation(CREATE_ACL)
  const [deleteAcl, { loading: deleteLoading }] = useMutation(DELETE_ACL)

  // When the data is fetched from CMR, update the state with the system
  // permissions from Acls and the permissions for the form
  useEffect(() => {
    const { acls } = data
    const { items } = acls

    const tableItems = Object.entries(systemIdentityPermissions).map((permission) => {
      const [key, value] = permission

      const { title } = value

      const acl = items
        .find((item) => (item.systemIdentity.target === key))

      // Initialize data that represents a single row in the permissions table
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

        const { groupPermissions = [] } = acl

        const groupPermission = groupPermissions.find((gp) => gp.group_id === id)

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

    setSystemPermissionsForForm(tableItems)
  }, [data])

  /**
   * Generates an update mutation object for updating ACL permissions.
   *
   * @param {string} conceptId - The concept ID.
   * @param {object} groupPermissions - The group permissions.
   * @param {string} target - The target.
   * @returns {object} - The update mutation object.
   */
  const generateUpdateMutation = (conceptId, groupPermissions, target) => ({
    variables: {
      conceptId,
      groupPermissions,
      systemIdentity: {
        target
      }
    },
    mutation: updateAcl
  })

  /**
   * Generates a mutation object for creating ACL (Access Control List) for a target with group permissions.
   *
   * @param {Array} groupPermissions - The group permissions for the ACL.
   * @param {string} target - The target for which the ACL is being created.
   * @returns {Object} - The mutation object.
   */
  const generateCreateMutation = (groupPermissions, target) => ({
    variables: {
      groupPermissions,
      systemIdentity: {
        target
      }
    },
    mutation: createAcl
  })

  /**
   * Generates a delete mutation for a given concept ID and target.
   *
   * @param {string} conceptId - The concept ID to be deleted.
   * @param {string} target - The target of the delete mutation.
   * @returns {object} - The delete mutation object.
   */
  const generateDeleteMutation = (conceptId) => ({
    variables: {
      conceptId
    },
    mutation: deleteAcl
  })

  const handleOnChangeToggleAll = (event) => {
    const allPermissions = systemPermissionsForForm.map((permission) => {
      const { target } = permission

      // Get the permitted permissions from constant we store
      const { [target]: targetedAcl = {} } = systemIdentityPermissions

      const { permittedPermissions = [] } = targetedAcl

      // Override the form permissions values
      return {
        ...permission,
        permissions: event.target.checked ? permittedPermissions : []
      }
    })

    setSystemPermissionsForForm(allPermissions)
  }

  const handleOnChange = (event, cellData, rowData) => {
    const targetIndex = systemPermissionsForForm.findIndex((item) => item.target === rowData.target)

    // If the checkbox is being checked add it, otherwise filter this value out
    const updatedRowData = {
      ...rowData,
      permissions: event.target.checked
        ? [...rowData.permissions, cellData]
        : rowData.permissions.filter((item) => item !== cellData)
    }

    // Create a copy of the system permissions
    const overwrittenSystemPermissions = systemPermissionsForForm

    // Overwrite the row data with the updated row data
    overwrittenSystemPermissions[targetIndex] = updatedRowData

    // Update the state with the updated system permissions
    setSystemPermissionsForForm([...overwrittenSystemPermissions])
  }

  const handleSubmit = async () => {
    const mutations = []

    systemPermissionsForForm.forEach((permission) => {
      const { target, permissions } = permission

      // Does an Acl with this target already exist in CMR?
      if (Object.keys(currentAcls).includes(target)) {
        const { [target]: targetedAcl } = currentAcls

        const { conceptId, groupPermissions = [] } = targetedAcl

        const groupPermission = groupPermissions.find((gp) => gp.group_id === id)

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
              if (groupPermissions.length === 1) {
                console.log(conceptId, '[delete]', target, 'this group is the only group in the Acl and the weve deleted all permissions', permissions)

                // Delete the Acl
                mutations.push(generateDeleteMutation(conceptId, target))

                return
              }

              console.log(conceptId, '[update]', target, 'remove group from group permission', permissions)

              // Remove this group from the group permission
              mutations.push(
                generateUpdateMutation(
                  conceptId,
                  groupPermissions.filter((gp) => gp.group_id !== id),
                  target
                )
              )

              return
            }

            // The permissions don't match CMR
            console.log(conceptId, '[update]', target, permissions)

            // Update the group permission
            mutations.push(
              generateUpdateMutation(
                conceptId,
                [
                  ...groupPermissions.filter((gp) => gp.group_id !== id),
                  {
                    permissions,
                    group_id: id
                  }
                ],
                target
              )
            )

            return
          }

          // The permissions match CMR
          console.log(conceptId, '[no change]', target, permissions)

          return
        }

        // This group does not exist in the Acl for this target in CMR
        if (permissions.length > 0) {
          console.log(conceptId, '[update]', target, 'add this group to the group permission', permissions)

          // Add this group to the group permission
          mutations.push(generateUpdateMutation(
            conceptId,
            [
              ...groupPermissions,
              {
                permissions,
                group_id: id
              }],
            target
          ))

          return
        }
      }

      // This target does not have an Acl in CMR
      if (permissions.length > 0) {
        console.log('[create]', target, permissions)

        // Create a new Acl
        mutations.push(generateCreateMutation([{
          permissions,
          group_id: id
        }], target))
      }
    })

    const results = await Promise.allSettled(
      mutations.map(({ mutation, variables }) => mutation({ variables }))
    )

    refetch()

    const totalMutations = results.length
    const successfulMutations = results.filter((result) => result.status === 'fulfilled')
    const failedMutations = results.filter((result) => result.status === 'rejected')

    if (totalMutations === successfulMutations.length) {
      addNotification({
        message: 'System permissions updated successfully.',
        variant: 'success'
      })
    } else if (totalMutations === failedMutations.length) {
      addNotification({
        message: 'Failed to update system permissions.',
        variant: 'danger'
      })
    } else {
      addNotification({
        message: 'Not all system permissions saved successfully, please check the form and try again.',
        variant: 'danger'
      })
    }
  }

  const buildCheckboxCell = useCallback((cellData, rowData) => {
    const {
      target,
      permissions
    } = rowData

    const { [target]: targetedAcl = {} } = systemIdentityPermissions

    const { permittedPermissions = [] } = targetedAcl

    return (
      <input
        aria-label={`${cellData} ${target.toLowerCase()}`}
        checked={permissions.includes(cellData)}
        data-testid={`${target.toLowerCase()}_${cellData}`}
        disabled={!permittedPermissions.includes(cellData)}
        name={`${target.toLowerCase()}_${cellData}`}
        onChange={(event) => handleOnChange(event, cellData, rowData)}
        type="checkbox"
      />
    )
  }, [systemPermissionsForForm])

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
          <div className="alert alert-light" role="alert">
            <FormLabel className="m-0">
              <input
                aria-label="Check/Uncheck all permissions"
                data-testid="toggle-all"
                name="toggle-all"
                onChange={handleOnChangeToggleAll}
                type="checkbox"
              />
              {' Check/Uncheck all permissions'}
            </FormLabel>
          </div>

          <Table
            className="m-5"
            columns={columns}
            data={systemPermissionsForForm}
            generateCellKey={({ target }, dataKey) => `column_${dataKey}_${target}`}
            generateRowKey={({ target }) => `row_${target}`}
            id={`${id}-permissions-table`}
            key={`${id}-permissions-table`}
            limit={Object.keys(systemIdentityPermissions).length}
          />

          <Button
            loading={updateLoading || createLoading || deleteLoading}
            loadingText="Saving..."
            onClick={handleSubmit}
            variant="primary"
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default SystemPermissions
