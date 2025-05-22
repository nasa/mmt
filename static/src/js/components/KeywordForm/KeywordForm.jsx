import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import CustomArrayTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import editKeywordsUiSchema from '@/js/schemas/uiSchemas/keywords/editKeyword'
import keywordSchema from '@/js/schemas/umm/keywordSchema'

import { convertFormDataToRdf } from '@/js/utils/convertFormDataToRdf'
import { createUpdateKmsConcept } from '@/js/utils/createUpdateKmsConcept'
import useAuthContext from '@/js/hooks/useAuthContext'
import KmsConceptSelectionWidget from '../KmsConceptSelectionWidget/KmsConceptSelectionWidget'

const KeywordForm = ({
  initialData,
  onFormDataChange,
  scheme,
  version,
  onSave
}) => {
  const [formData, setFormData] = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [userNote, setUserNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savingError, setSavingError] = useState(null)
  const { token } = useAuthContext()

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

  const handleSubmit = () => {
    setShowModal(true)
  }

  const handleFinalSubmit = async () => {
    setIsSaving(true)
    setSavingError(null)
    try {
      const rdfXml = convertFormDataToRdf(formData, userNote, scheme)
      await createUpdateKmsConcept({
        rdfXml,
        version,
        token
      })

      setShowModal(false)
      setUserNote('')
      onSave(formData.KeywordUUID)
    } catch (error) {
      setSavingError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

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
        onSubmit={handleSubmit}
        validator={validator}
      >
        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </Form>
      <CustomModal
        show={showModal}
        toggleModal={() => setShowModal(false)}
        header="User Note"
        message={
          (
            <div>
              <label htmlFor="userNote" className="form-label">Add a user note for your change (optional):</label>
              <textarea
                id="userNote"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Enter user note"
                rows={4}
                className="form-control"
              />
              {
                isSaving && (
                  <div className="text-primary mt-2">
                    <Spinner animation="border" size="sm" />
                    {' '}
                    Saving...
                  </div>
                )
              }
              {savingError && <div className="text-danger mt-2">{savingError}</div>}

            </div>
          )
        }
        actions={
          [
            {
              label: 'Cancel',
              variant: 'secondary',
              onClick: () => setShowModal(false),
              disabled: isSaving
            },
            {
              label: 'Save',
              variant: 'primary',
              onClick: handleFinalSubmit,
              disabled: isSaving
            }
          ]
        }
      />
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
  }).isRequired,
  onSave: PropTypes.func.isRequired
}

export default KeywordForm
