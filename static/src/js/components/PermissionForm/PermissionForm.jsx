import Form from '@rjsf/core'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { isEmpty } from 'lodash-es'

import { useNavigate, useParams } from 'react-router'

import validator from '@rjsf/validator-ajv8'
import collectionPermission from '@/js/schemas/collectionPermission'

import collectionPermissionUiSchema from '@/js/schemas/uiSchemas/collectionPermission'

import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'

import saveTypes from '@/js/constants/saveTypes'

import { useMutation, useSuspenseQuery } from '@apollo/client'

import useAppContext from '@/js/hooks/useAppContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import removeEmpty from '@/js/utils/removeEmpty'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

import CollectionSelectorPage from '@/js/pages/CollectionSelectorPage/CollectionSelectorPage'

import { cloneDeep } from '@apollo/client/utilities'
import {
  GET_COLLECTION_FOR_PERMISSION_FORM
} from '@/js/operations/queries/getCollectionForPermissionForm'
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

/**
 * Validates the form data for the access constraints and temporal constraints.
 *
 * @param {Object} formData - The data submitted in the form.
 * @param {Object} errors - The errors object to record validation errors.
 * @returns {Object} - The errors object with any validation errors added.
 */
/**
 * Validates the form data and populates the 'errors' object with any validation errors found.
 *
 * @param {Object} formData - The form data to validate.
 * @param {Object} errors - The object to store validation errors.
 * @returns {Object} - The 'errors' object populated with any validation errors.
 */
const validate = (formData, errors) => {
  const { accessConstraintFilter, temporalConstraintFilter, groupPermissions } = formData

  const { collectionAccessConstraint, granuleAccessConstraint } = accessConstraintFilter || {}

  const { collectionTemporalConstraint, granuleTemporalConstraint } = temporalConstraintFilter || {}

  // Destructure specific properties to avoid repeated code
  const {
    minimumValue: collectionMinValue,
    maximumValue: collectionMaxValue
  } = collectionAccessConstraint || {}

  const {
    minimumValue: granuleMinValue,
    maximumValue: granuleMaxValue
  } = granuleAccessConstraint || {}

  // Validate collectionAccessConstraint min and max values
  if (collectionMinValue !== undefined
    && collectionMaxValue !== undefined
     && collectionMinValue >= collectionMaxValue) {
    const {
      collectionAccessConstraint: {
        minimumValue,
        maximumValue
      }
    } = errors.accessConstraintFilter
    minimumValue.addError('Minimum value should be less than Maximum value')
    maximumValue.addError('Maximum value should be greater than Minimum value')
  }

  // Validate granuleAccessConstraint min and mix values
  if (granuleMinValue !== undefined
     && granuleMaxValue !== undefined
     && granuleMinValue >= granuleMaxValue) {
    const {
      granuleAccessConstraint: {
        minimumValue,
        maximumValue
      }
    } = errors.accessConstraintFilter

    minimumValue.addError('Minimum value should be less than Maximum value')
    maximumValue.addError('Maximum value should be greater than Minimum value')
  }

  // Destructure and parse dates for collectionTemporalConstraint
  const collectionStartDate = new Date(collectionTemporalConstraint?.startDate)
  const collectionStopDate = new Date(collectionTemporalConstraint?.stopDate)

  // Validate collectionTemporalConstraint startDate and stopDate
  if (collectionStartDate
    && collectionStopDate
    && collectionStartDate >= collectionStopDate) {
    const {
      collectionTemporalConstraint: {
        startDate,
        stopDate
      }
    } = errors.temporalConstraintFilter

    startDate.addError('Start date should be earlier than Stop date')
    stopDate.addError('Stop date should be later than Start date')
  }

  // Destructure and parse dates for granuleTemporalConstraint
  const granuleStartDate = new Date(granuleTemporalConstraint?.startDate)
  const granuleStopDate = new Date(granuleTemporalConstraint?.stopDate)

  // Validate granuleTemporalConstraint startDate and stopDate
  if (granuleStartDate
    && granuleStopDate
    && granuleStartDate >= granuleStopDate) {
    const {
      granuleTemporalConstraint: {
        startDate,
        stopDate
      }
    } = errors.temporalConstraintFilter
    startDate.addError('Start date should be earlier than Stop date')
    stopDate.addError('Stop date should be later than Start date')
  }

  // Validate groupPermissions
  if (isEmpty(groupPermissions)) {
    errors.groupPermissions.addError('At least one group permission must be specified')
  }

  return errors
}

/**
 * Renders a PermissionForm component
 *
 * @component
 * @example <caption>Render a PermissionForm</caption>
 * return (
 *   <PermissionForm />
 * )
 */
const PermissionForm = ({ selectedCollectionsPageSize }) => {
  const {
    draft,
    originalDraft,
    setDraft,
    setOriginalDraft,
    providerId,
    setProviderId
  } = useAppContext()

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { conceptId = 'new' } = useParams()

  const [focusField, setFocusField] = useState(null)
  const [uiSchema, setUiSchema] = useState(collectionPermissionUiSchema)

  const [chooseProviderModalOpen, setChooseProviderModalOpen] = useState(false)

  const [createAclMutation] = useMutation(CREATE_ACL)
  const [updateAclMutation] = useMutation(UPDATE_ACL, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of acl from the cache. This ensures that if the user returns to the list page they will see the correct data.
          acl: () => {}
        }
      })
    }
  })

  useEffect(() => {
    if (providerId) {
      const newUiSchema = cloneDeep(uiSchema)
      newUiSchema.collectionSelection.selectedCollections['ui:providerId'] = providerId
      setUiSchema(newUiSchema)
    }
  }, [providerId])

  const fields = {
    keywordPicker: KeywordPicker,
    TitleField: CustomTitleField,
    CollectionSelector: CollectionSelectorPage,
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

  const [error, setError] = useState(null)

  const updateQuery = (prev, { fetchMoreResult }) => {
    const newResult = cloneDeep(prev)
    const { acl } = newResult
    const { collections } = acl
    const { items = [] } = collections || {}

    items.push(...fetchMoreResult.acl.collections.items)

    return newResult
  }

  const { data, fetchMore } = useSuspenseQuery(GET_COLLECTION_FOR_PERMISSION_FORM, {
    skip: conceptId === 'new',
    variables: {
      conceptId,
      params: {
        offset: 0,
        limit: selectedCollectionsPageSize
      }
    }
  })

  useEffect(() => {
    async function fetchData() {
      if (!data) return

      const { acl } = data
      const { collections } = acl
      const { count, items = [] } = collections || {}

      if (items.length < count) {
        await fetchMore({
          variables: {
            conceptId,
            params: {
              offset: items.length,
              limit: selectedCollectionsPageSize
            }
          },
          updateQuery
        })
      }
    }

    fetchData()
      .catch((err) => {
        errorLogger('Error fetching more collection permissions', 'PermissionForm: fetchData')
        setError(err)
      })
  }, [data])

  useEffect(() => {
    if (conceptId === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [conceptId])

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  /**
   * Updates the UI schema based on the granule access permission in the provided form data.
   *
   * @param {Object} formData - The form data containing access permissions.
   * @param {Object} formData.accessPermission - The access permissions within the form data.
   * @param {boolean} formData.accessPermission.granule - The flag indicating if granule access is allowed.
   */
  const showGranuleFields = (formData) => {
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
  }

  // When 'data' is available, this block generates formData using information from the ACL from CMR.
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

      // Map through items of collection to extract selected collection properties
      const selectedCollections = items?.reduce((obj, item) => ({
        ...obj,
        [item.conceptId]: item
      }), {})

      const searchAndOrderGroupPermission = []
      const searchPermission = []

      // Loop through groups,
      // creates two arrays: one for search permissions and another for search and order permissions.
      groups.items?.forEach((item) => {
        const {
          id,
          name: groupName,
          permissions,
          userType,
          tag
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
            provider: tag,
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
        collectionIdentifier,
        granuleApplicable,
        granuleIdentifier,
        providerId: savedProviderId
      } = catalogItemIdentity

      setProviderId(savedProviderId)

      const {
        accessValue: collectionAccessValue,
        temporal: collectionTemporal
      } = collectionIdentifier || {}

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

      // Construct formData object
      const formData = {
        accessConstraintFilter: {
          collectionAccessConstraint: {
            includeUndefined: collectionIncludeUndefined,
            maximumValue: collectionMaxValue,
            minimumValue: collectionMinValue
          },
          granuleAccessConstraint: {
            includeUndefined: granuleIncludeUndefined,
            maximumValue: granuleMaxValue,
            minimumValue: granuleMinValue
          }
        },
        accessPermission: {
          collection: collectionApplicable,
          granule: granuleApplicable
        },
        collectionSelection: {
          allCollection: true,
          selectedCollections
        },
        groupPermissions: {
          searchAndOrderGroup: searchAndOrderGroupPermission,
          searchGroup: searchPermission
        },
        name,
        temporalConstraintFilter: {
          collectionTemporalConstraint: {
            mask: collectionMask,
            startDate: collectionStartDate,
            stopDate: collectionStopDate
          },
          granuleTemporalConstraint: {
            mask: granuleMask,
            startDate: granuleStartDate,
            stopDate: granuleStopDate
          }
        }
      }

      // Call the function to show/hide granule fields based on formData
      showGranuleFields(formData)

      // Update the draft with formData by removing empty fields
      setDraft({ formData: removeEmpty(formData) })
    }
  }, [data])

  const handleChange = (event) => {
    const { formData } = event

    showGranuleFields(formData)

    setDraft({
      ...draft,
      formData: removeEmpty(formData)
    })
  }

  const providerIdCheckFails = (aclProviderId, conceptIds) => conceptIds.some((identifier) => {
    const conceptProviderId = identifier.split('-')[1]

    return conceptProviderId !== aclProviderId
  })

  const { formData } = draft || {}

  /**
   * Handles the submission of the permission form.
   * This function constructs a formData object based on the provided form data,
   * and then performs a mutation to either create or update permissions.
   */
  const handleSubmit = () => {
    const {
      accessConstraintFilter,
      accessPermission,
      collectionSelection,
      groupPermissions,
      name,
      temporalConstraintFilter
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

    // Extract conceptIds from selectedCollections
    const { selectedCollections } = collectionSelection

    let conceptIds = []
    if (selectedCollections) {
      conceptIds = Object.keys(selectedCollections).map(
        (key) => selectedCollections[key].conceptId
      )
    }

    if (providerIdCheckFails(providerId, conceptIds)) {
      errorLogger('Error creating collection permission', 'PermissionForm: providerIdCheck')
      addNotification({
        message: 'Error multiple providers in collections',
        variant: 'danger'
      })

      return
    }

    // Extract permissions from groupPermissions
    const { searchGroup, searchAndOrderGroup } = groupPermissions

    let searchGroupPermissions = []

    let searchAndOrderGroupPermissions = []

    if (searchGroup) {
      searchGroupPermissions = searchGroup.map((item) => {
        const { value } = item
        // Handle special cases for guest and registered users
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
    }

    if (searchAndOrderGroup) {
      searchAndOrderGroupPermissions = searchAndOrderGroup?.map((item) => {
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
    }

    // Combine searchGroupPermissions and searchAndOrderGroupPermissions into permissions array
    const permissions = searchGroupPermissions.concat(searchAndOrderGroupPermissions)

    // Construct catalogItemIdentity object
    const catalogItemIdentity = {
      collectionApplicable,
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
      granuleApplicable,
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
      },
      name,
      providerId
    }

    // Perform mutation to create or update permissions
    if (conceptId === 'new') {
      createAclMutation({
        variables: {
          catalogItemIdentity: removeEmpty(catalogItemIdentity),
          groupPermissions: removeEmpty(permissions)
        },
        onCompleted: (getCreateData) => {
          const { createAcl } = getCreateData

          const { conceptId: aclConceptId } = createAcl

          addNotification({
            message: 'Collection permission created',
            variant: 'success'
          })

          navigate(`/permissions/${aclConceptId}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating permission',
            variant: 'danger'
          })

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

          addNotification({
            message: 'Collection permission updated',
            variant: 'success'
          })

          navigate(`/permissions/${aclConceptId}`)
        },
        onError: () => {
          addNotification({
            message: 'Error creating permission',
            variant: 'danger'
          })

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
              liveValidate
              widgets={widgets}
              schema={collectionPermission}
              validator={validator}
              templates={templates}
              uiSchema={uiSchema}
              onChange={handleChange}
              formData={removeEmpty(formData)}
              onSubmit={handleSetProviderOrSubmit}
              showErrorList="false"
              customValidate={validate}
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

PermissionForm.defaultProps = {
  selectedCollectionsPageSize: 2000
}

PermissionForm.propTypes = {
  selectedCollectionsPageSize: PropTypes.number
}

export default PermissionForm
