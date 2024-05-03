import React, { Suspense, useState } from 'react'

import {
  FaEdit,
  FaEye,
  FaTrash
} from 'react-icons/fa'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router'

import pluralize from 'pluralize'

import { DELETE_ORDER_OPTION } from '@/js/operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'
import { GET_ORDER_OPTIONS } from '@/js/operations/queries/getOrderOptions'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import OrderOption from '@/js/components/OrderOption/OrderOption'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import useAppContext from '@/js/hooks/useAppContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'
import toKebabCase from '@/js/utils/toKebabCase'

/**
 * Renders a OrderOptionPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionPageHeader</caption>
 * return (
 *   <OrderOptionPageHeader />
 * )
 */
const OrderOptionPageHeader = () => {
  const { user } = useAppContext()
  const { providerId } = user

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { conceptId } = useParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteOrderOptionMutation] = useMutation(DELETE_ORDER_OPTION, {
    refetchQueries: [{
      query: GET_ORDER_OPTIONS,
      variables: {
        params: {
          providerId
        }
      }
    }]
  })

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const { orderOption = {} } = data
  const {
    name,
    nativeId
  } = orderOption

  const handleDelete = () => {
    deleteOrderOptionMutation({
      variables: {
        nativeId,
        providerId
      },
      onCompleted: () => {
        addNotification({
          message: 'Order Option was successfully deleted.',
          variant: 'success'
        })

        navigate('/order-options')
      },
      onError: () => {
        addNotification({
          message: 'Error deleting order option',
          variant: 'danger'
        })

        errorLogger('Unable delete order option', 'Order Option Page: deleteOrderOption Mutation')

        setShowDeleteModal(false)
      }
    })
  }

  return (
    <>
      <PageHeader
        additionalActions={
          [
            {
              icon: FaEye,
              to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}/collection-association`,
              title: 'Collection Associations'
            }
          ]
        }
        title={name}
        breadcrumbs={
          [
            {
              label: 'Order Options',
              to: '/order-options'
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
              variant: 'danger'
            }
          ]
        }
      />
      <CustomModal
        message="Are you sure you want to delete this order option?"
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
 * Renders a OrderOptionPage component
 *
 * @component
 * @example <caption>Render a OrderOptionPage</caption>
 * return (
 *   <OrderOptionPage />
 * )
 */
const OrderOptionPage = () => (
  <Page
    pageType="secondary"
    header={<OrderOptionPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <OrderOption />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionPage
