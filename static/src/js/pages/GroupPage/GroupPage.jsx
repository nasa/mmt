import React, { Suspense, useState } from 'react'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router'
import {
  FaEdit,
  FaKey,
  FaTrash
} from 'react-icons/fa'

import CustomModal from '../../components/CustomModal/CustomModal'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Group from '../../components/Group/Group'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import { DELETE_GROUP } from '../../operations/mutations/deleteGroup'
import { GET_GROUP } from '../../operations/queries/getGroup'
import { GET_GROUPS } from '../../operations/queries/getGroups'

import errorLogger from '../../utils/errorLogger'

/**
 * Renders a GroupPageHeader component
 *
 * @component
 * @example <caption>Render a GroupPageHeader</caption>
 * return (
 *   <GroupPageHeader />
 * )
 */
const GroupPageHeader = () => {
  const { user } = useAppContext()
  const { providerId } = user

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { id } = useParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{
      // TODO this needs updating
      query: GET_GROUPS,
      variables: {
        params: {
          tag: providerId
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
          message: 'Group was successfully deleted.',
          variant: 'success'
        })

        navigate('/groups')
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

  return (
    <>
      <PageHeader
        title={name}
        breadcrumbs={
          [
            {
              label: 'Groups',
              to: '/groups'
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
              variant: 'primary'
            },
            {
              icon: FaTrash,
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              iconTitle: 'A trash can icon',
              variant: 'danger',
              disabled: count > 0,
              disabledTooltipText: count > 0 ? 'Can\'t delete groups that have members.' : null
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
        message="Are you sure you want to delete this group?"
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
 * Renders a GroupPage component
 *
 * @component
 * @example <caption>Render a GroupPage</caption>
 * return (
 *   <GroupPage />
 * )
 */
const GroupPage = () => (
  <Page
    pageType="secondary"
    header={<GroupPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <Group />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default GroupPage
