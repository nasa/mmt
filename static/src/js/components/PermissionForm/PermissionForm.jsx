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
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'

const PermissionForm = () => {
  const [uiSchema, setUiSchema] = useState(collectionPermissionUiSchema)
  console.log('🚀 ~ PermissionForm ~ uiSchema:', uiSchema)

  const handleChange = (event) => {
    // Const { formData } = event
    // if (formData.name) {
    //   console.log('in here')
    //   const newUiSchema = {
    //     ...uiSchema.accessConstraintFilter['ui:disabled'] = false
    //   }

    //   setUiSchema(newUiSchema)
    // }
  }

  const fields = {
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    SelectWidget: CustomSelectWidget
  }

  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate,
    TitleFieldTemplate: CustomTitleFieldTemplate

  }

  return (
    <Container className="permission-form__container mx-0" fluid>
      <Row>
        <Col>
          <Form
            fields={fields}
            widgets={widgets}
            schema={collectionPermission}
            templates={templates}
            validator={validator}
            uiSchema={collectionPermissionUiSchema}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default PermissionForm
