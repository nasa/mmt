import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'

import CustomArrayTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomRadioWidget from '../CustomRadioWidget/CustomRadioWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import BoundingRectangleField from '../BoundingRectangleField/BoundingRectangleField'

import ErrorBanner from '../ErrorBanner/ErrorBanner'
import FormNavigation from '../FormNavigation/FormNavigation'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

import toolsUiSchema from '../../schemas/uiSchemas/tools'
import formConfigurations from '../../schemas/uiForms'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'

import convertToDottedNotation from '../../utils/convertToDottedNotation'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getFormSchema from '../../utils/getFormSchema'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'
import removeEmpty from '../../utils/removeEmpty'

import './MetadataForm.scss'

const MetadataForm = () => {
  const {
    conceptId,
    sectionName,
    fieldName
  } = useParams()
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  const [validationErrors, setValidationErrors] = useState([])
  const [draftMetadata, setDraftMetadata] = useState(null)
  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)

  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    setFocusField(`root_${fieldName}`)
  }, [fieldName])

  const [ingestDraftMutation, {
    data: ingestDraftData,
    loading: ingestDraftLoading,
    error: ingestDraftError
  }] = useMutation(INGEST_DRAFT)

  const { data, loading, error } = useQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  const { draft } = data

  if (!draft) {
    return (
      <Page>
        <ErrorBanner message="Draft could not be loaded." />
      </Page>
    )
  }

  const {
    conceptType,
    // Name,
    // nativeId,
    // providerId,
    ummMetadata
  } = draft

  const schema = getUmmSchema(conceptType)
  const uiSchema = toolsUiSchema[sectionName]
  const formSections = formConfigurations[conceptType]

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: schema,
    formConfigurations: formSections,
    formName: sectionName
  })

  const fields = {
    // Layout: LayoutGridField, // chris
    // streetAddresses: StreetAddressesField, // chris
    boundingRectangle: BoundingRectangleField // Hoan
    // keywordPicker: KeywordsField, // deep
    // TitleField: CustomTitleField,
    // OneOfField,
    // AnyOfField: () => null
  }
  const widgets = {
    TextWidget: CustomTextWidget,
    TextareaWidget: CustomTextareaWidget,
    SelectWidget: CustomSelectWidget,
    DateTimeWidget: CustomDateTimeWidget,
    // CountrySelectWiget: CustomCountrySelectWidget,
    RadioWidget: CustomRadioWidget
    // CheckboxWidget: CustomRadioWidget
  }
  const templates = {
    // DescriptionFieldTemplate: CustomDescriptionFieldTemplate,
    ArrayFieldTemplate: CustomArrayTemplate // deep
    // FieldTemplate: CustomFieldTemplate,
    // TitleFieldTemplate: CustomTitleFieldTemplate
  }

  const handleSave = (type) => {
    console.log('🚀 ~ file: MetadataForm.jsx:128 ~ handleSave ~ type:', type)
    // TODO call ingestDraftMutation()
  }

  const handleCancel = () => {
    setDraftMetadata(ummMetadata)
  }

  // Handle form changes
  const handleChange = (event) => {
    const { formData } = event

    setDraftMetadata(removeEmpty(formData))
  }

  // Handle bluring fields within the form
  const handleBlur = (fieldId) => {
    // Add the blurred field into `visitedFields`
    const path = convertToDottedNotation(fieldId.replace('root', ''))

    setVisitedFields([...new Set([
      ...visitedFields,
      path
    ])])
  }

  return (
    <Page>
      <Container id="metadata-form__container">
        <Row className="sidebar_column">
          <Col sm={8}>
            {/* <MMTForm */}
            <Form
              // Key={`${JSON.stringify(draft.key)}`}
              validator={validator}
              schema={formSchema}
              // formData={ummMetadata}
              // TODO we don't like doing it this way
              formData={draftMetadata || ummMetadata}
              uiSchema={uiSchema}
              fields={fields}
              templates={templates}
              formContext={
                {
                  focusField,
                  setFocusField
                }
              }
              widgets={widgets}
              onChange={handleChange}
              onBlur={handleBlur}
              liveValidate
              transformErrors={
                (errors) => {
                  setValidationErrors(errors)

                  return []
                }
              }
            />
          </Col>

          <Col sm={4}>
            <div className="metadata-form__navigation sticky-top">
              <FormNavigation
                draft={ummMetadata}
                fullSchema={schema}
                formSections={formSections}
                loading={ingestDraftLoading}
                validationErrors={validationErrors}
                visitedFields={visitedFields}
                onSave={handleSave}
                onCancel={handleCancel}
                setFocusField={setFocusField}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </Page>
  )
}

export default MetadataForm
