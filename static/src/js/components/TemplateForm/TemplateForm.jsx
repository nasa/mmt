import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { kebabCase } from 'lodash-es'
import useAppContext from '../../hooks/useAppContext'

import collectionsTemplateConfiguration from '../../schemas/uiForms/collectionTemplatesConfiguration.'
import collectionsUiSchema from '../../schemas/uiSchemas/collections'
import FormNavigation from '../FormNavigation/FormNavigation'
import Page from '../Page/Page'
import ummCTemplateSchema from '../../schemas/umm/ummCTemplateSchema'

import BoundingRectangleField from '../BoundingRectangleField/BoundingRectangleField'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomCountrySelectWidget from '../CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomRadioWidget from '../CustomRadioWidget/CustomRadioWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import GridLayout from '../GridLayout/GridLayout'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import OneOfField from '../OneOfField/OneOfField'
import StreetAddressField from '../StreetAddressField/StreetAddressField'

import createTemplate from '../../utils/createTemplate'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import errorLogger from '../../utils/errorLogger'
import getFormSchema from '../../utils/getFormSchema'
import getNextFormName from '../../utils/getNextFormName'
import getTemplate from '../../utils/getTemplate'
import JsonPreview from '../JsonPreview/JsonPreview'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import parseError from '../../utils/parseError'
import saveTypes from '../../constants/saveTypes'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import updateTemplate from '../../utils/updateTemplate'
import useNotificationsContext from '../../hooks/useNotificationsContext'

const TemplateForm = () => {
  const {
    id = 'new',
    sectionName,
    fieldName
  } = useParams()

  const navigate = useNavigate()

  const {
    draft,
    originalDraft,
    setDraft,
    user
  } = useAppContext()

  const { token, providerId } = user
  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)
  const [error, setErrors] = useState()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loading, setLoading] = useState()

  const { addNotification } = useNotificationsContext()

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

  // Handle bluring fields within the form
  const handleBlur = (fieldId) => {
    setVisitedFields([...new Set([
      ...visitedFields,
      fieldId
    ])])
  }

  const name = draft?.ummMetadata?.TemplateName || '<Blank Name>'
  const pageTitle = id === 'new' ? 'New Collection Template' : `Edit ${name}`

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

  return (
    <Page
      title={pageTitle}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Collection Templates',
            to: '/templates/collections'
          },
          (
            id !== 'new' && {
              label: name,
              to: `/templates/collections/${id}`
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
                loading={saveLoading}
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
