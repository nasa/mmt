import React, { Suspense, useState } from 'react'

import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router'

import {
  FaEdit,
  FaEye,
  FaTrash
} from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import pluralize from 'pluralize'

import { DELETE_ORDER_OPTION } from '@/js/operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'
import toKebabCase from '@/js/utils/toKebabCase'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import OrderOption from '@/js/components/OrderOption/OrderOption'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

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
  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { conceptId } = useParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteOrderOptionMutation] = useMutation(DELETE_ORDER_OPTION, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of orderOptions from the cache. This ensures that if the user returns to the list page they will see the correct data.
          orderOptions: () => {}
        }
      })
    }
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
    nativeId,
    providerId
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
              to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}/collection-association-search`,
              title: 'Add Collection Associations'
            }
          ]
        }
        title={name}
        titleBadge={providerId}
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

/*
 * Renders a `OrderOptionPagePlaceholder` component.
 *
 * This component renders a order option page placeholder
 *
 * @param {OrderOptionPagePlaceholder} props
 *
 * @component
 * @example <caption>Render the order option page placeholder</caption>
 * return (
 *   <OrderOptionPagePlaceholder />
 * )
 */
const OrderOptionPagePlaceholder = () => (
  <Row>
    <Col>
      <Placeholder animation="glow" aria-hidden="true">
        <span className="d-block w-100 mb-4 mt-2">
          <Placeholder className="w-25 d-block mb-2" size="sm" />
        </span>
        <span className="d-block w-100 mb-4 mt-2">
          <Placeholder className="w-100 mb-2" />
          <Placeholder className="w-75 mb-2" />
        </span>
        <span className="d-flex flex-column w-100 mb-4 mt-2">
          <Placeholder className="mb-2" style={{ width: '3rem' }} />
          <Placeholder className="mb-2 ms-2" style={{ width: '6rem' }} />
          <Placeholder className="mb-2 ms-4" style={{ width: '8rem' }} />
          <Placeholder className="mb-2 ms-5" style={{ width: '10rem' }} />
          <Placeholder className="mb-2 ms-4" style={{ width: '8rem' }} />
          <Placeholder className="mb-2 ms-2" style={{ width: '6rem' }} />
          <Placeholder className="mb-2" style={{ width: '3rem' }} />
          <Placeholder className="mb-2 ms-2" style={{ width: '10rem' }} />
          <Placeholder className="mb-2" style={{ width: '3rem' }} />
        </span>
      </Placeholder>
    </Col>
  </Row>
)

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
      <Suspense fallback={<OrderOptionPagePlaceholder />}>
        <OrderOption />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionPage
