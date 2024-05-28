import Form from '@rjsf/core'
import React, { useState } from 'react'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'

import validator from '@rjsf/validator-ajv8'

import collectionPermission from '@/js/schemas/collectionPermission'

import collectionPermissionUiSchema from '@/js/schemas/uiSchemas/collectionPermission'
import collectionsUiSchema from '@/js/schemas/uiSchemas/collections'
import useAppContext from '@/js/hooks/useAppContext'
import removeEmpty from '@/js/utils/removeEmpty'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import CustomCheckboxWidget from '../CustomCheckboxWidget/CustomCheckboxWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import OneOfField from '../OneOfField/OneOfField'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import CollectionSelector from '../CollectionSelector/CollectionSelector'

const PermissionForm = () => {
  const {
    draft,
    setDraft
  } = useAppContext()

  const [focusField, setFocusField] = useState(null)
  const [uiSchema, setUiSchema] = useState(collectionPermissionUiSchema)

  const handleChange = (event) => {
    const { formData } = event

    const { accessPermission } = formData
    const { permission } = accessPermission || {}
    const { granule } = permission || {}

    if (formData.accessPermission?.permission?.granule) {
      const newUiSchema = {
        ...collectionPermissionUiSchema,
        accessConstraintFilter: {
          ...collectionPermissionUiSchema.accessConstraintFilter,
          granuleAssessConstraint: {
            ...collectionPermissionUiSchema.accessConstraintFilter.granuleAssessConstraint,
            'ui:disabled': false
          }
        },
        temporalConstraintFilter:{
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
          granuleAssessConstraint: {
            ...collectionPermissionUiSchema.accessConstraintFilter.granuleAssessConstraint,
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

  const fields = {
    keywordPicker: KeywordPicker,
    TitleField: CustomTitleField,
    CollectionSelector: CollectionSelector,
    layout: GridLayout,
    OneOfField
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    SelectWidget: CustomSelectWidget,
    DateTimeWidget: CustomDateTimeWidget,
  }

  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate,
    // TitleFieldTemplate: CustomTitleFieldTemplate

  }

  return (
    <Container className="permission-form__container mx-0" fluid>
      <Row>
        <Col>
          <Form
            formContext={
              {
                focusField,
                setFocusField
              }
            }
            fields={fields}
            widgets={widgets}
            schema={collectionPermission}
            templates={templates}
            validator={validator}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default PermissionForm
