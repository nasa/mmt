import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import CustomArrayTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import editKeywordsUiSchema from '@/js/schemas/uiSchemas/keywords/editKeyword'
import keywordSchema from '@/js/schemas/umm/keywordSchema'

import KmsConceptSelectionWidget from '../KmsConceptSelectionWidget/KmsConceptSelectionWidget'

const KeywordForm = ({
  initialData,
  onFormDataChange,
  scheme,
  version
}) => {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const fields = {
    kmsConceptSelection: KmsConceptSelectionWidget,
    layout: GridLayout
  }
  const widgets = {
    TextWidget: CustomTextWidget,
    TextareaWidget: CustomTextareaWidget
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
        formContext={
          {
            scheme,
            version
          }
        }
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
    AlternateLabels: PropTypes.arrayOf(PropTypes.shape({
      LabelName: PropTypes.string,
      LabelType: PropTypes.string
    })),
    BroaderKeywords: PropTypes.arrayOf(PropTypes.shape({
      BroaderUUID: PropTypes.string
    })),
    ChangeLogs: PropTypes.string,
    Definition: PropTypes.string,
    DefinitionReference: PropTypes.string,
    KeywordUUID: PropTypes.string,
    NarrowerKeywords: PropTypes.arrayOf(PropTypes.shape({
      NarrowerUUID: PropTypes.string
    })),
    PreferredLabel: PropTypes.string,
    RelatedKeywords: PropTypes.arrayOf(PropTypes.shape({
      RelationshipType: PropTypes.string,
      UUID: PropTypes.string
    })),
    Resources: PropTypes.arrayOf(PropTypes.shape({
      ResourceType: PropTypes.string,
      ResourceUri: PropTypes.string
    }))
  }),
  onFormDataChange: PropTypes.func,
  scheme: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  version: PropTypes.shape({
    version: PropTypes.string,
    version_type: PropTypes.string
  }).isRequired
}

export default KeywordForm
