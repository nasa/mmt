import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router'
import {
  FaEdit,
  FaKey,
  FaTrash
} from 'react-icons/fa'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import Group from '@/js/components/Group/Group'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import usePermissions from '@/js/hooks/usePermissions'

import { DELETE_GROUP } from '@/js/operations/mutations/deleteGroup'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { GET_GROUPS } from '@/js/operations/queries/getGroups'

import errorLogger from '@/js/utils/errorLogger'

/**
 * Renders a GroupPageHeader component
 *
 * @component
 * @example <caption>Render a GroupPageHeader</caption>
 * return (
 *   <GroupPageHeader />
 * )
 */
const GroupPageHeader = ({ isAdminPage }) => {
  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { id } = useParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { hasSystemGroup } = usePermissions({
    systemGroup: ['create']
  })

  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{
      query: GET_GROUPS,
      variables: {
        params: {
          name: '',
          tags: isAdminPage ? ['CMR'] : undefined
        }
      }
    }]
  })

  const { data } = useSuspenseQuery(GET_GROUP, {
    variables: {
      params: {
        id
      }
    }
  })

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const { group = {} } = data
  const { members, name, tag: providerId } = group
  const { count } = members

  const handleDelete = () => {
    deleteGroupMutation({
      variables: {
        id
      },
      onCompleted: () => {
        addNotification({
          message: `${isAdminPage ? 'System ' : ''}Group was successfully deleted.`,
          variant: 'success'
        })

        navigate(`${isAdminPage ? '/admin' : ''}/groups`, { replace: true })
      },
      onError: () => {
        addNotification({
          message: 'Error deleting group',
          variant: 'danger'
        })

        errorLogger('Unable delete group', 'Group Page: deleteGroup Mutation')

        setShowDeleteModal(false)
      }
    })
  }

  const title = `${isAdminPage ? 'System ' : ''}Groups`

  return (
    <>
      <PageHeader
        title={name}
        titleBadge={providerId}
        breadcrumbs={
          [
            {
              label: title,
              to: `${isAdminPage ? '/admin' : ''}/groups`
            },
            {
              label: name,
              active: true
            }
          ]
        }
        pageType="secondary"
        primaryActions={
          [
            {
              icon: FaEdit,
              to: 'edit',
              title: 'Edit',
              iconTitle: 'A edit icon',
              variant: 'primary',
              visible: !isAdminPage || hasSystemGroup
            },
            {
              icon: FaTrash,
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              iconTitle: 'A trash can icon',
              variant: 'danger',
              disabled: count > 0,
              disabledTooltipText: count > 0 ? 'Can\'t delete groups that have members.' : null,
              visible: !isAdminPage || hasSystemGroup
            },
            {
              icon: FaKey,
              to: 'permissions',
              title: `${!isAdminPage ? 'Provider' : ''} Permissions`,
              iconTitle: 'A key icon',
              variant: 'light-dark'
            }
          ]
        }
      />
      <CustomModal
        message={`Are you sure you want to delete this ${isAdminPage ? 'system ' : ''}group?`}
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

GroupPageHeader.defaultProps = {
  isAdminPage: false
}

GroupPageHeader.propTypes = {
  isAdminPage: PropTypes.bool
}

/**
 * Renders a GroupPage component
 *
 * @component
 * @example <caption>Render a GroupPage</caption>
 * return (
 *   <GroupPage />
 * )
 */
const GroupPage = ({ isAdminPage }) => (
  <Page
    pageType="secondary"
    header={<GroupPageHeader isAdminPage={isAdminPage} />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <Group isAdminPage={isAdminPage} />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupPage.defaultProps = {
  isAdminPage: false
}

GroupPage.propTypes = {
  isAdminPage: PropTypes.bool
}

export default GroupPage
