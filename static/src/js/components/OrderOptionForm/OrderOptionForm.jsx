import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'

import { useMutation, useSuspenseQuery } from '@apollo/client'

import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'

import orderOption from '../../schemas/orderOption'
import orderOptionUiSchema from '../../schemas/uiSchemas/OrderOption'

import { CREATE_ORDER_OPTION } from '../../operations/mutations/createOrderOption'
import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'
import { UPDATE_ORDER_OPTION } from '../../operations/mutations/updateOrderOption'

import useNotificationsContext from '../../hooks/useNotificationsContext'
import useAppContext from '../../hooks/useAppContext'

import errorLogger from '../../utils/errorLogger'
import removeEmpty from '../../utils/removeEmpty'

/**
 * Renders a OrderOptionForm component
 *
 * @component
 * @example <caption>Render a OrderOptionForm</caption>
 * return (
 *   <OrderOptionForm />
 * )
 */
const OrderOptionForm = () => {
  const {
    draft,
    originalDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  } = useAppContext()

  const { providerId } = user

  const navigate = useNavigate()

  const { conceptId = 'new' } = useParams()

  const { addNotification } = useNotificationsContext()

  const [focusField, setFocusField] = useState(null)

  const [createOrderOptionMutation] = useMutation(CREATE_ORDER_OPTION)
  const [updateOrderOptionMutation] = useMutation(UPDATE_ORDER_OPTION, {
    refetchQueries: [{
      query: GET_ORDER_OPTION,
      variables: {
        params: {
          conceptId
        }
      }
    }]
  })

  const [nativeId, setNativeId] = useState()
  const [deprecated, setDeprecated] = useState()

  const fields = {
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    TextareaWidget: CustomTextareaWidget
  }

  const templates = {
    FieldTemplate: CustomFieldTemplate
  }

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId
      }
    }
  })

  useEffect(() => {
    const { orderOption: orderOptionData } = data || {}
    const {
      description,
      form,
      name,
      sortKey,
      nativeId: fetchedNativeId,
      deprecated: fetchedDeprecated
    } = orderOptionData || {}

    const formData = {
      description,
      form,
      name
    }

    if (sortKey) {
      formData.sortKey = sortKey
    }

    setNativeId(fetchedNativeId)
    setDeprecated(fetchedDeprecated || false)

    setDraft({ formData })
    setOriginalDraft({ formData })
  }, [data])

  useEffect(() => {
    if (conceptId === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [conceptId])

  // Handle form changes
  const handleChange = (event) => {
    const { formData } = event

    setDraft({
      ...draft,
      formData: removeEmpty(formData)
    })
  }

  const { formData } = draft || {}

  const handleSubmit = () => {
    const orderOptionVariables = {
      ...formData,
      scope: 'PROVIDER',
      providerId,
      deprecated
    }

    if (conceptId === 'new') {
      createOrderOptionMutation({
        variables: orderOptionVariables,
        onCompleted: (mutationData) => {
          const { createOrderOption } = mutationData
          const { conceptId: orderOptionId } = createOrderOption

          addNotification({
            message: 'Order option created successfully',
            variant: 'success'
          })

          navigate(`/order-options/${orderOptionId}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating Order Option',
            variant: 'danger'
          })

          errorLogger('Error creating order option', 'OrderOptionForm: createOrderOptionMutation')
        }
      })
    } else {
      updateOrderOptionMutation({
        variables: {
          ...orderOptionVariables,
          nativeId
        },
        onCompleted: (updatedOrderOption) => {
          const { updateOrderOption } = updatedOrderOption

          addNotification({
            message: 'Order option updated successfully',
            variant: 'success'
          })

          // Sets savedDraft so the orderOption preview can request the correct version
          setSavedDraft(updateOrderOption)

          navigate(`/order-options/${conceptId}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating Order Option',
            variant: 'danger'
          })

          errorLogger('Error updating order option', 'OrderOptionForm: updateOrderOptionMutation')
        }
      })
    }
  }

  const handleClear = () => {
    setDraft(originalDraft)
    addNotification({
      message: 'Order option cleared successfully',
      variant: 'success'
    })
  }

  return (
    <Container className="order-option-form__container mx-0" fluid>
      <Row>
        <Col>
          <Form
            fields={fields}
            formContext={
              {
                focusField,
                setFocusField
              }
            }
            widgets={widgets}
            schema={orderOption}
            validator={validator}
            templates={templates}
            uiSchema={orderOptionUiSchema}
            onChange={handleChange}
            formData={formData}
            onSubmit={handleSubmit}
            showErrorList="false"
          >
            <div className="d-flex gap-2">
              <Button type="submit">
                Submit
              </Button>
              <Button
                onClick={handleClear}
                variant="secondary"
              >
                Clear
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderOptionForm
