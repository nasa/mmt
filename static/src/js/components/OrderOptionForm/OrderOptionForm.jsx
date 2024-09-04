import React, {
  createRef,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'

import { useMutation, useSuspenseQuery } from '@apollo/client'

import orderOption from '@/js/schemas/orderOption'
import orderOptionUiSchema from '@/js/schemas/uiSchemas/OrderOption'

import { CREATE_ORDER_OPTION } from '@/js/operations/mutations/createOrderOption'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'
import { UPDATE_ORDER_OPTION } from '@/js/operations/mutations/updateOrderOption'

import useAppContext from '@/js/hooks/useAppContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import removeEmpty from '@/js/utils/removeEmpty'

import ChooseProviderModal from '@/js/components/ChooseProviderModal/ChooseProviderModal'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'
import saveTypes from '@/js/constants/saveTypes'

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
    providerId,
    setDraft,
    setOriginalDraft,
    setSavedDraft
  } = useAppContext()

  const navigate = useNavigate()

  const { conceptId = 'new' } = useParams()

  const { addNotification } = useNotificationsContext()

  const [focusField, setFocusField] = useState(null)

  const [fetchProviderId, setFetchProviderId] = useState()

  const [createOrderOptionMutation] = useMutation(CREATE_ORDER_OPTION, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of orderOptions from the cache. This ensures that if the user returns to the list page they will see the correct data.
          orderOptions: () => {}
        }
      })
    }
  })
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
  const [chooseProviderModalOpen, setChooseProviderModalOpen] = useState(false)
  const [visitedFields, setVisitedFields] = useState([])

  const formRef = createRef()

  // Handle bluring fields within the form
  const handleBlur = (fieldId) => {
    setVisitedFields([...new Set([
      ...visitedFields,
      fieldId
    ])])
  }

  const handleTransformErrors = (errors) => errors.filter((error) => {
    if (conceptId === 'new') {
      return visitedFields.includes(error.property)
    }

    return errors
  })

  useEffect(() => {
    formRef?.current?.validateForm()
  }, [visitedFields])

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
    if (data) {
      const { orderOption: orderOptionData } = data
      const {
        deprecated,
        description,
        form,
        name,
        nativeId: fetchedNativeId,
        providerId: formProviderId,
        sortKey
      } = orderOptionData

      setFetchProviderId(formProviderId)

      const formData = {
        deprecated: false,
        description,
        form,
        name
      }

      if (sortKey) {
        formData.sortKey = sortKey
      }

      if (deprecated) {
        formData.deprecated = deprecated
      }

      setNativeId(fetchedNativeId)

      setDraft({ formData })
      setOriginalDraft({ formData })
    }
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
      providerId: fetchProviderId || providerId
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

  const handleSetProviderOrSubmit = () => {
    if (conceptId === 'new') {
      setChooseProviderModalOpen(true)

      return
    }

    handleSubmit()
  }

  const handleClear = () => {
    setDraft(originalDraft)
    addNotification({
      message: 'Order option cleared successfully',
      variant: 'success'
    })
  }

  const hasErrors = () => {
    const { errors } = validator.validateFormData(formData, orderOption)

    return errors.length > 0
  }

  return (
    <>
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
              formData={formData}
              liveValidate
              onBlur={handleBlur}
              onChange={handleChange}
              onSubmit={handleSetProviderOrSubmit}
              ref={formRef}
              schema={orderOption}
              showErrorList="false"
              templates={templates}
              transformErrors={handleTransformErrors}
              uiSchema={orderOptionUiSchema}
              validator={validator}
              widgets={widgets}
            >
              <div className="d-flex gap-2">
                <Button
                  disabled={hasErrors()}
                  type="submit"
                >
                  {saveTypesToHumanizedStringMap[saveTypes.submit]}
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
      <ChooseProviderModal
        show={chooseProviderModalOpen}
        primaryActionType={saveTypes.submit}
        toggleModal={
          () => {
            setChooseProviderModalOpen(false)
          }
        }
        type="order option"
        onSubmit={
          () => {
            handleSubmit()
            setChooseProviderModalOpen(false)
          }
        }
      />
    </>
  )
}

export default OrderOptionForm
