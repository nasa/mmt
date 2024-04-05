import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { kebabCase } from 'lodash-es'
import useAppContext from '../../hooks/useAppContext'
import Page from '../Page/Page'
import FormNavigation from '../FormNavigation/FormNavigation'
import ummCTemplateSchema from '../../schemas/umm/ummCTemplateSchema'
import collectionsTemplateConfiguration from '../../schemas/uiForms/collectionTemplatesConfiguration.'
import collectionsUiSchema from '../../schemas/uiSchemas/collections'
import BoundingRectangleField from '../BoundingRectangleField/BoundingRectangleField'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import GridLayout from '../GridLayout/GridLayout'
import OneOfField from '../OneOfField/OneOfField'
import StreetAddressField from '../StreetAddressField/StreetAddressField'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import CustomRadioWidget from '../CustomRadioWidget/CustomRadioWidget'
import CustomCountrySelectWidget from '../CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import getFormSchema from '../../utils/getFormSchema'
import JsonPreview from '../JsonPreview/JsonPreview'
import createTemplate from '../../utils/createTemplate'

const TemplateForm = () => {
  const {
    id = 'new',
    sectionName,
    fieldName,
    templateType
  } = useParams()

  const {
    draft,
    originalDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  } = useAppContext()

  const { token } = user
  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)

  const fields = {
    AnyOfField: () => null,
    BoundingRectangle: BoundingRectangleField,
    keywordPicker: KeywordPicker,
    layout: GridLayout,
    OneOfField,
    streetAddresses: StreetAddressField,
    TitleField: CustomTitleField
  }

  const widgets = {
    CheckboxWidget: CustomRadioWidget,
    CountrySelectWidget: CustomCountrySelectWidget,
    DateTimeWidget: CustomDateTimeWidget,
    RadioWidget: CustomRadioWidget,
    SelectWidget: CustomSelectWidget,
    TextareaWidget: CustomTextareaWidget,
    TextWidget: CustomTextWidget
  }
  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate,
    TitleFieldTemplate: CustomTitleFieldTemplate
  }
  const { ummMetadata = {} } = draft || {}

  const [firstFormSection] = collectionsTemplateConfiguration
  const firstSectionName = kebabCase(firstFormSection.displayName)
  const currentSection = sectionName || firstSectionName

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: ummCTemplateSchema,
    formConfigurations: collectionsTemplateConfiguration,
    formName: currentSection
  })

  // Handle blurring fields within the form
  const handleBlur = (fieldId) => {
    setVisitedFields([...new Set([
      ...visitedFields,
      fieldId
    ])])
  }

  // Handle form changes
  const handleChange = (event) => {
    const { formData } = event

    setDraft({
      ...draft,
      ummMetadata: formData
    })
  }

  // Handle the cancel button. Reset the form to the last time we fetched the draft from CMR
  const handleCancel = () => {
    setDraft(originalDraft)
    setVisitedFields([])
  }

  const handleSave = async (type) => {
    const { response } = createTemplate('MMT_2', token, ummMetadata)
  }

  const pageTitle = id === 'new' ? 'New Collection Template' : 'Edit someName'

  return (
    <Page
      title={pageTitle}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Collection Template',
            to: `/templates/${templateType}`
          },
          (
            id !== 'new' && {
              label: 'Add the template name here'
              // To: `/drafts/${draftType}/${conceptId}`
            }
          ),
          {
            label: pageTitle,
            active: true
          }
        ]
      }
    >
      <Container className="template-form__container mx-0">
        <Row className="template-form__row">
          <Col
            className="mb-5"
            xs="auto"
            md={
              {
                span: 4,
                order: 2
              }
            }
          >
            <div className="template-form__navigation sticky-top p-0 ps-md-3 ps-lg-5 top-0 pt-md-3">
              <FormNavigation
                draft={ummMetadata}
                fullSchema={ummCTemplateSchema}
                formSections={collectionsTemplateConfiguration}
                // Loading={ingestDraftLoading}
                visitedFields={visitedFields}
                onSave={handleSave}
                onCancel={handleCancel}
                schema={ummCTemplateSchema}
                setFocusField={setFocusField}
                uiSchema={collectionsUiSchema}
              />
            </div>
          </Col>
          <Col
            xs="auto"
            md={
              {
                span: 8,
                order: 1
              }
            }
            className="p-md-0"
          >
            <Form
              fields={fields}
              formContext={
                {
                  focusField,
                  setFocusField
                }
              }
              formData={ummMetadata}
              onBlur={handleBlur}
              onChange={handleChange}
              schema={formSchema}
              templates={templates}
              uiSchema={collectionsUiSchema[currentSection]}
              validator={validator}
              widgets={widgets}
            />
          </Col>
        </Row>
        <Row className="json-view">
          <Col sm={8}>
            <JsonPreview />
          </Col>
        </Row>
      </Container>
    </Page>
  )
}

export default TemplateForm
