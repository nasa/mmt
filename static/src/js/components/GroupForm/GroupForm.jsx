import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'

import { useMutation, useSuspenseQuery } from '@apollo/client'

import groupSchema from '@/js/schemas/group'
import systemGroupSchema from '@/js/schemas/systemGroup'
import groupUiSchema from '@/js/schemas/uiSchemas/Group'
import systemGroupUiSchema from '@/js/schemas/uiSchemas/SystemGroup'

import { CREATE_GROUP } from '@/js/operations/mutations/createGroup'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { UPDATE_GROUP } from '@/js/operations/mutations/updateGroup'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import useAppContext from '@/js/hooks/useAppContext'

import getPermittedUser from '@/js/utils/getPermittedUser'

import errorLogger from '@/js/utils/errorLogger'
import removeEmpty from '@/js/utils/removeEmpty'

import ChooseProviderModal from '@/js/components/ChooseProviderModal/ChooseProviderModal'
import CustomArrayFieldTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import saveTypes from '@/js/constants/saveTypes'
import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'

/**
 * Renders a GroupForm component
 *
 * @component
 * @example <caption>Render a GroupForm</caption>
 * return (
 *   <GroupForm />
 * )
 */
const GroupForm = ({ isAdminPage }) => {
  const {
    draft,
    originalDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  } = useAppContext()

  const navigate = useNavigate()

  const { id = 'new' } = useParams()

  const { addNotification } = useNotificationsContext()

  const [focusField, setFocusField] = useState(null)
  const [chooseProviderModalOpen, setChooseProviderModalOpen] = useState(false)

  const [createGroupMutation] = useMutation(CREATE_GROUP)

  const [updateGroupMutation] = useMutation(UPDATE_GROUP, {
    refetchQueries: [{
      query: GET_GROUP,
      variables: {
        params: {
          id
        }
      }
    }]
  })

  const permittedUser = getPermittedUser(user)
  const { data: providerData } = useSuspenseQuery(GET_AVAILABLE_PROVIDERS, {
    skip: isAdminPage,
    variables: {
      params: {
        limit: 500,
        permittedUser,
        target: 'PROVIDER_CONTEXT'
      }
    }
  })

  const updatedGroupSchema = isAdminPage ? systemGroupSchema : groupSchema

  if (!isAdminPage) {
    updatedGroupSchema.properties.provider.enum = providerData?.acls.items?.map(
      (item) => item.providerIdentity.provider_id
    )
  }

  const fields = {
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    SelectWidget: CustomSelectWidget,
    TextareaWidget: CustomTextareaWidget
  }

  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate
  }

  const { data } = useSuspenseQuery(GET_GROUP, {
    skip: id === 'new',
    variables: {
      params: {
        id
      }
    }
  })

  useEffect(() => {
    if (data) {
      const { group: groupData } = data
      const {
        description,
        name,
        members,
        tag
      } = groupData

      const { items } = members
      const memberObjects = items.map((member) => ({
        id: member.id,
        label: `${member.firstName} ${member.lastName}`
      }))

      const formData = {
        description,
        name,
        provider: isAdminPage ? undefined : tag,
        members: memberObjects
      }

      setDraft({ formData })
      setOriginalDraft({ formData })
    }
  }, [data])

  useEffect(() => {
    if (id === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [id])

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
    const groupVariables = {
      ...formData,
      tag: isAdminPage ? 'CMR' : formData.provider,
      // Members needs to default to an empty string if no members are provided by the form
      members: formData.members?.length > 0 ? formData.members.map((member) => member.id).join(', ') : '',

      // `provider` is not a variable in the GraphQL mutation
      provider: undefined
    }

    if (id === 'new') {
      createGroupMutation({
        variables: groupVariables,
        onCompleted: (mutationData) => {
          const { createGroup } = mutationData
          const { id: groupId } = createGroup

          addNotification({
            message: 'Group created successfully',
            variant: 'success'
          })

          navigate(`${isAdminPage ? '/admin' : ''}/groups/${groupId}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating group',
            variant: 'danger'
          })

          errorLogger('Error creating group', 'GroupForm: createGroupMutation')
        }
      })
    } else {
      updateGroupMutation({
        variables: {
          ...groupVariables,
          id
        },
        onCompleted: (updatedGroup) => {
          const { updateGroup } = updatedGroup

          addNotification({
            message: 'Group updated successfully',
            variant: 'success'
          })

          // Sets savedDraft so the group preview can request the correct version
          setSavedDraft(updateGroup)

          navigate(`${isAdminPage ? '/admin' : ''}/groups/${id}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating Group',
            variant: 'danger'
          })

          errorLogger('Error updating group', 'GroupForm: updateGroupMutation')
        }
      })
    }
  }

  const handleSetProviderOrSubmit = () => {
    if (id === 'new' && !isAdminPage) {
      setChooseProviderModalOpen(true)

      return
    }

    handleSubmit()
  }

  const handleClear = () => {
    setDraft(originalDraft)
    addNotification({
      message: 'Group cleared successfully',
      variant: 'success'
    })
  }

  return (
    <>
      <Container className="group-form__container mx-0" fluid>
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
              schema={updatedGroupSchema}
              validator={validator}
              templates={templates}
              uiSchema={isAdminPage ? systemGroupUiSchema : groupUiSchema}
              onChange={handleChange}
              formData={formData}
              onSubmit={handleSetProviderOrSubmit}
              showErrorList="false"
            >
              <div className="d-flex gap-2">
                <Button type="submit">
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
        primaryActionType={saveTypesToHumanizedStringMap[saveTypes.submit]}
        toggleModal={
          () => {
            setChooseProviderModalOpen(false)
          }
        }
        type="group"
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

GroupForm.defaultProps = {
  isAdminPage: false
}

GroupForm.propTypes = {
  isAdminPage: PropTypes.bool
}

export default GroupForm
