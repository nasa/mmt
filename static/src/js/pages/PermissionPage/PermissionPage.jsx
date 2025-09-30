import { useMutation, useSuspenseQuery } from '@apollo/client'

import React, { Suspense, useState } from 'react'

import { useNavigate, useParams } from 'react-router'

import { FaEdit, FaTrash } from 'react-icons/fa'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import Permission from '@/js/components/Permission/Permission'

import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'

/**
 * Renders a PermissionListPageHeader component
 *
 * @component
 * @example <caption>Render a PermissionPageHeader</caption>
 * return (
 *   <PermissionPageHeader />
 * )
 */
const PermissionPageHeader = () => {
  const { conceptId } = useParams()

  const { addNotification } = useNotificationsContext()

  const navigate = useNavigate()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const [deleteAclMutation] = useMutation(DELETE_ACL, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of permissions from the cache. This ensures that if the user returns to the list page they will see the correct data.
          permissions: () => {}
        }
      })
    }
  })

  const { data = {} } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    variables: {
      conceptId
    }
  })

  const { acl = {} } = data || {}
  const { name = 'Untitled Permission' } = acl || {}

  const handleDelete = () => {
    deleteAclMutation({
      variables: {
        conceptId
      },
      onCompleted: () => {
        addNotification({
          message: 'Collection permission was successfully deleted.',
          variant: 'success'
        })

        navigate('/permissions')
      },
      onError: () => {
        addNotification({
          message: 'Error deleting collection permission',
          variant: 'danger'
        })

        errorLogger('Unable delete collection permission', 'Permission Page: deleteAcl Mutation')

        setShowDeleteModal(false)
      }
    })
  }

  return (
    <>
      <PageHeader
        breadcrumbs={
          [
            {
              label: 'Collection Permissions',
              to: '/permissions'
            },
            {
              label: name,
              active: true
            }
          ]
        }
        pageType="secondary"
        title={name}
        primaryActions={
          [
            {
              icon: FaEdit,
              to: 'edit',
              title: 'Edit',
              iconTitle: 'A edit icon',
              variant: 'primary'
            },
            {
              icon: FaTrash,
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              iconTitle: 'A trash can icon',
              variant: 'danger'
            }
          ]
        }
      />
      <CustomModal
        message="Are you sure you want to delete this collection permission?"
        show={showDeleteModal}
        size="lg"
        toggleModal={toggleShowDeleteModal}
        actions={
          [
            {
              label: 'No',
              variant: 'secondary',
              onClick: () => { toggleShowDeleteModal(false) }
            },
            {
              label: 'Yes',
              variant: 'primary',
              onClick: handleDelete
            }
          ]
        }
      />
    </>
  )
}

/**
 * Renders a PermissionPage component
 *
 * @component
 * @example <caption>Render a PermissionPage</caption>
 * return (
 *   <PermissionPage />
 * )
 */
const PermissionPage = () => (
  <Page
    pageType="secondary"
    header={<PermissionPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <Permission />
      </Suspense>
    </ErrorBoundary>
  </Page>

)

export default PermissionPage
