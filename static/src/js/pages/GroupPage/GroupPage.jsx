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
const GroupPageHeader = ({ isAdmin }) => {
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
          tags: isAdmin ? ['CMR'] : undefined
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
  const { members, name } = group
  const { count } = members

  const handleDelete = () => {
    deleteGroupMutation({
      variables: {
        id
      },
      onCompleted: () => {
        addNotification({
          message: `${isAdmin ? 'System ' : ''}Group was successfully deleted.`,
          variant: 'success'
        })

        navigate(`${isAdmin ? '/admin' : ''}/groups`)
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

  const title = `${isAdmin ? 'System ' : ''}Groups`

  return (
    <>
      <PageHeader
        title={name}
        breadcrumbs={
          [
            {
              label: title,
              to: `${isAdmin ? '/admin' : ''}/groups`
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
              visible: !isAdmin || hasSystemGroup
            },
            {
              icon: FaTrash,
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              iconTitle: 'A trash can icon',
              variant: 'danger',
              disabled: count > 0,
              disabledTooltipText: count > 0 ? 'Can\'t delete groups that have members.' : null,
              visible: !isAdmin || hasSystemGroup
            },
            {
              icon: FaKey,
              to: 'permissions',
              title: 'Provider Permissions',
              iconTitle: 'A key icon',
              variant: 'light-dark'
            }
          ]
        }
      />
      <CustomModal
        message={`Are you sure you want to delete this ${isAdmin ? 'system ' : ''}group?`}
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
  isAdmin: false
}

GroupPageHeader.propTypes = {
  isAdmin: PropTypes.bool
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
const GroupPage = ({ isAdmin }) => (
  <Page
    pageType="secondary"
    header={<GroupPageHeader isAdmin={isAdmin} />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <Group />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupPage.defaultProps = {
  isAdmin: false
}

GroupPage.propTypes = {
  isAdmin: PropTypes.bool
}

export default GroupPage
