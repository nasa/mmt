import Form from '@rjsf/core'
import React, { useEffect, useState } from 'react'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'

import validator from '@rjsf/validator-ajv8'
import collectionPermission from '@/js/schemas/collectionPermission'

import collectionPermissionUiSchema from '@/js/schemas/uiSchemas/collectionPermission'
import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'

import saveTypes from '@/js/constants/saveTypes'

import { useNavigate, useParams } from 'react-router'
import { useMutation, useSuspenseQuery } from '@apollo/client'

import useAppContext from '@/js/hooks/useAppContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import removeEmpty from '@/js/utils/removeEmpty'

import Button from 'react-bootstrap/Button'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

import CollectionSelector from '../CollectionSelector/CollectionSelector'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import GridLayout from '../GridLayout/GridLayout'
import GroupPermissionSelect from '../GroupPermissionSelect/GroupPermissionSelect'
import KeywordPicker from '../KeywordPicker/KeywordPicker'

import ChooseProviderModal from '../ChooseProviderModal/ChooseProviderModal'

const PermissionForm = () => {
  const {
    draft,
    originalDraft,
    providerId,
    setDraft,
    setOriginalDraft
  } = useAppContext()

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { conceptId = 'new' } = useParams()

  const [focusField, setFocusField] = useState(null)
  const [uiSchema, setUiSchema] = useState(collectionPermissionUiSchema)

  const [chooseProviderModalOpen, setChooseProviderModalOpen] = useState(false)

  const [createAclMutation] = useMutation(CREATE_ACL)
  const [updateAclMutation] = useMutation(UPDATE_ACL)

  const fields = {
    keywordPicker: KeywordPicker,
    TitleField: CustomTitleField,
    CollectionSelector,
    GroupPermissionSelect,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    SelectWidget: CustomSelectWidget,
    DateTimeWidget: CustomDateTimeWidget
  }

  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate,
    TitleField: CustomTitleFieldTemplate
  }

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    skip: conceptId === 'new',
    variables: {
      conceptId
    }
  })

  useEffect(() => {
    if (conceptId === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [conceptId])

  useEffect(() => {
    if (data) {
      const { acl } = data
      const {
        name,
        catalogItemIdentity,
        groups,
        collections
      } = acl

      const { items } = collections || {}

      const selectedCollections = items?.map((item) => {
        const { conceptId: collectionConceptId, shortName, title } = item

        return {
          conceptId: collectionConceptId,
          entryTitle: title,
          shortName
        }
      })

      const searchAndOrderGroupPermission = []
      const searchPermission = []

      groups.items?.forEach((item) => {
        const {
          id,
          name: groupName,
          permissions,
          userType
        } = item

        const groupObj = userType
          ? {
            value: `all-${userType}-user`,
            label: `All ${userType} user`,
            isDisabled: true
          }
          : {
            value: id,
            label: groupName,
            isDisabled: true
          }

        if (permissions.length === 2) {
          searchAndOrderGroupPermission.push(groupObj)
        } else {
          searchPermission.push(groupObj)
        }
      })

      const {
        collectionApplicable,
        granuleApplicable,
        collectionIdentifier,
        granuleIdentifier
      } = catalogItemIdentity

      const {
        accessValue: collectionAccessValue,
        temporal: collectionTemporal
      } = collectionIdentifier

      const {
        accessValue: granuleAccessValue,
        temporal: granuleTemporal
      } = granuleIdentifier || {}

      const {
        minValue: collectionMinValue,
        maxValue: collectionMaxValue,
        includeUndefinedValue: collectionIncludeUndefined
      } = collectionAccessValue || {}

      const {
        minValue: granuleMinValue,
        maxValue: granuleMaxValue,
        includeUndefinedValue: granuleIncludeUndefined
      } = granuleAccessValue || {}

      const {
        startDate: collectionStartDate,
        stopDate: collectionStopDate,
        mask: collectionMask
      } = collectionTemporal || {}

      const {
        startDate: granuleStartDate,
        stopDate: granuleStopDate,
        mask: granuleMask
      } = granuleTemporal || {}

      const formData = {
        name,
        accessPermission: {
          collection: collectionApplicable,
          granule: granuleApplicable
        },
        accessConstraintFilter: {
          collectionAccessConstraint: {
            minimumValue: collectionMinValue,
            maximumValue: collectionMaxValue,
            includeUndefined: collectionIncludeUndefined
          },
          granuleAccessConstraint: {
            minimumValue: granuleMinValue,
            maximumValue: granuleMaxValue,
            includeUndefined: granuleIncludeUndefined
          }
        },
        collectionSelection: {
          allCollection: true,
          selectedCollections
        },
        temporalConstraintFilter: {
          collectionTemporalConstraint: {
            startDate: collectionStartDate,
            stopDate: collectionStopDate,
            mask: collectionMask
          },
          granuleTemporalConstraint: {
            startDate: granuleStartDate,
            stopDate: granuleStopDate,
            mask: granuleMask
          }
        },
        groupPermissions: {
          searchAndOrderGroup: searchAndOrderGroupPermission,
          searchGroup: searchPermission
        }

      }

      setDraft({ formData: removeEmpty(formData) })
    }
  }, [data])

  const handleChange = (event) => {
    const { formData } = event

    if (formData.accessPermission?.granule) {
      const newUiSchema = {
        ...collectionPermissionUiSchema,
        accessConstraintFilter: {
          ...collectionPermissionUiSchema.accessConstraintFilter,
          granuleAccessConstraint: {
            ...collectionPermissionUiSchema.accessConstraintFilter.granuleAccessConstraint,
            'ui:disabled': false
          }
        },
        temporalConstraintFilter: {
          ...collectionPermissionUiSchema.temporalConstraintFilter,
          granuleTemporalConstraint: {
            ...collectionPermissionUiSchema.temporalConstraintFilter.granuleTemporalConstraint,
            'ui:disabled': false
          }
        }
      }
      setUiSchema(newUiSchema)
    } else {
      const newUiSchema = {
        ...collectionPermissionUiSchema,
        accessConstraintFilter: {
          ...collectionPermissionUiSchema.accessConstraintFilter,
          granuleAccessConstraint: {
            ...collectionPermissionUiSchema.accessConstraintFilter.granuleAccessConstraint,
            'ui:disabled': true
          }
        }
      }
      setUiSchema(newUiSchema)
    }

    setDraft({
      ...draft,
      formData: removeEmpty(formData)
    })
  }

  const { formData } = draft || {}

  const handleSubmit = () => {
    const {
      accessConstraintFilter,
      accessPermission,
      collectionSelection,
      name,
      temporalConstraintFilter,
      groupPermissions
    } = formData

    const {
      collection: collectionApplicable = false,
      granule: granuleApplicable = false
    } = accessPermission || {}

    const { collectionAccessConstraint, granuleAccessConstraint } = accessConstraintFilter || {}

    const {
      collectionTemporalConstraint,
      granuleTemporalConstraint
    } = temporalConstraintFilter || {}

    const {
      includeUndefined: collectionIncludeUndefined,
      maximumValue: collectionMaxValue,
      minimumValue: collectionMinValue
    } = collectionAccessConstraint || {}

    const {
      includeUndefined: granuleIncludeUndefined,
      maximumValue: granuleMaxValue,
      minimumValue: granuleMinValue
    } = granuleAccessConstraint || {}

    const {
      mask: collectionMask,
      startDate: collectionStartDate,
      stopDate: collectionStopDate
    } = collectionTemporalConstraint || {}

    const {
      mask: granuleMask,
      startDate: granuleStartDate,
      stopDate: granuleStopDate
    } = granuleTemporalConstraint || {}

    const { selectedCollections } = collectionSelection

    const conceptIds = selectedCollections?.map((item) => {
      const { conceptId: selectedConceptId } = item

      return selectedConceptId
    })

    const { searchGroup, searchAndOrderGroup } = groupPermissions

    const searchGroupPermissions = searchGroup?.map((item) => {
      const { value } = item

      if (value === 'all-guest-user') {
        return {
          permissions: ['read'],
          userType: 'guest'
        }
      }

      if (value === 'all-registered-user') {
        return {
          permissions: ['read'],
          userType: 'registered'
        }
      }

      return {
        permissions: ['read'],
        groupId: value
      }
    })

    const searchAndOrderGroupPermissions = searchAndOrderGroup?.map((item) => {
      const { value } = item

      if (value === 'all-guest-user') {
        return {
          permissions: ['read', 'order'],
          userType: 'guest'
        }
      }

      if (value === 'all-registered-user') {
        return {
          permissions: ['read', 'order'],
          userType: 'registered'
        }
      }

      return {
        permissions: ['read', 'order'],
        groupId: value
      }
    })

    const permissions = searchGroupPermissions?.concat(searchAndOrderGroupPermissions)

    const catalogItemIdentity = {
      name,
      providerId,
      collectionApplicable,
      granuleApplicable,
      collectionIdentifier: {
        conceptIds,
        accessValue: {
          includeUndefinedValue: collectionIncludeUndefined,
          maxValue: collectionMaxValue,
          minValue: collectionMinValue
        },
        temporal: {
          mask: collectionMask?.toLowerCase(),
          startDate: collectionStartDate,
          stopDate: collectionStopDate
        }
      },
      granuleIdentifier: {
        accessValue: {
          includeUndefinedValue: granuleIncludeUndefined,
          maxValue: granuleMaxValue,
          minValue: granuleMinValue
        },
        temporal: {
          mask: granuleMask?.toLowerCase(),
          startDate: granuleStartDate,
          stopDate: granuleStopDate
        }
      }
    }

    if (conceptId === 'new') {
      createAclMutation({
        variables: {
          catalogItemIdentity: removeEmpty(catalogItemIdentity),
          groupPermissions: removeEmpty(permissions)
        },
        onCompleted: (getCreateData) => {
          const { createAcl } = getCreateData

          const { conceptId: aclConceptId } = createAcl
          navigate(`/permissions/${aclConceptId}`)
        },
        onError: () => {
          // Add an error notification
          addNotification({
            message: 'Error creating permission',
            variant: 'danger'
          })

          // Send the error to the errorLogger
          errorLogger('Error creating collection permission', 'PermissionForm: createAclMutation')
        }
      })
    } else {
      updateAclMutation({
        variables: {
          catalogItemIdentity: removeEmpty(catalogItemIdentity),
          conceptId,
          groupPermissions: removeEmpty(permissions)
        },
        onCompleted: (getCreateData) => {
          const { updateAcl } = getCreateData

          const { conceptId: aclConceptId } = updateAcl
          navigate(`/permissions/${aclConceptId}`)
        },
        onError: () => {
          // Add an error notification
          addNotification({
            message: 'Error creating permission',
            variant: 'danger'
          })

          // Send the error to the errorLogger
          errorLogger('Error creating collection permission', 'PermissionForm: updateAclMutation')
        }
      })
    }
  }

  const handleClear = () => {
    setDraft(originalDraft)
    addNotification({
      message: 'Collection Permission cleared successfully',
      variant: 'success'
    })
  }

  const handleSetProviderOrSubmit = () => {
    if (conceptId === 'new') {
      setChooseProviderModalOpen(true)

      return
    }

    handleSubmit()
  }

  return (
    <>
      <Container className="permission-form__container mx-0" fluid>
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
              schema={collectionPermission}
              validator={validator}
              templates={templates}
              uiSchema={uiSchema}
              onChange={handleChange}
              formData={formData}
              onSubmit={handleSetProviderOrSubmit}
              showErrorList="false"
            >
              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
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
        type="collectionPermission"
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

export default PermissionForm
