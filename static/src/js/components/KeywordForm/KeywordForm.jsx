import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'

import CustomArrayTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import GridLayout from '@/js/components/GridLayout/GridLayout'

import editKeywordsUiSchema from '@/js/schemas/uiSchemas/keywords/editKeyword'
import keywordSchema from '@/js/schemas/umm/keywordSchema'

const KeywordForm = ({
  initialData,
  onFormDataChange
}) => {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const fields = {
    layout: GridLayout
  }
  const widgets = {
    TextareaWidget: CustomTextareaWidget,
    TextWidget: CustomTextWidget
  }
  const templates = {
    ArrayFieldTemplate: CustomArrayTemplate,
    FieldTemplate: CustomFieldTemplate
  }

  const handleChange = ({ formData: newFormData }) => {
    setFormData(newFormData)
    onFormDataChange(newFormData)
  }

  // Handlesubmit to be completed in MMT-4003
  // const handleSubmit = ({ submitFormData }) => {
  //   console.log('Form submitted:', submitFormData)
  // }

  return (
    <div className="keyword-form">
      <h2>Edit Keyword</h2>
      <Form
        fields={fields}
        templates={templates}
        widgets={widgets}
        schema={keywordSchema}
        uiSchema={editKeywordsUiSchema}
        formData={formData}
        onChange={handleChange}
        // OnSubmit={handleSubmit}
        validator={validator}
      >
        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </Form>
    </div>
  )
}

KeywordForm.defaultProps = {
  initialData: {},
  onFormDataChange: () => {}
}

KeywordForm.propTypes = {
  initialData: PropTypes.shape({
    KeywordUUID: PropTypes.string,
    BroaderKeyword: PropTypes.string,
    NarrowerKeywords: PropTypes.arrayOf(PropTypes.shape({
      NarrowerUUID: PropTypes.string
    })),
    PreferredLabel: PropTypes.string,
    AlternateLabels: PropTypes.arrayOf(PropTypes.shape({
      LabelName: PropTypes.string,
      LabelType: PropTypes.string
    })),
    Definition: PropTypes.string,
    DefinitionReference: PropTypes.string,
    Resources: PropTypes.arrayOf(PropTypes.shape({
      ResourceType: PropTypes.string,
      ResourceUri: PropTypes.string
    })),
    RelatedKeywords: PropTypes.arrayOf(PropTypes.shape({
      UUID: PropTypes.string,
      RelationshipType: PropTypes.string
    })),
    ChangeLogs: PropTypes.string
  }),
  onFormDataChange: PropTypes.func
}

export default KeywordForm
