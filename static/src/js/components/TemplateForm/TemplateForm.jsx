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
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'

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

  const {
    ingestMutation,
    ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

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

  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    setFocusField(fieldName)

    // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
    if (fieldName && sectionName) navigate(`/templates/collections/${id}/${sectionName}`, { replace: true })
  }, [fieldName])

  // Fetching collection template if ID is present and draft is not loaded
  useEffect(() => {
    const fetchTemplate = async () => {
      const { response, error: fetchTemplateError } = await getTemplate(providerId, token, id)

      if (response) {
        delete response.pathParameters

        setDraft({
          ummMetadata: response
        })
      } else { setErrors(fetchTemplateError) }

      setLoading(false)
    }

    if (id !== 'new' && !draft) {
      setLoading(true)
      fetchTemplate()
    }
  }, [id])

  const handleSave = async (type) => {
    setSaveLoading(true)
    let savedId = null
    if (id === 'new') {
      const response = await createTemplate(providerId, token, ummMetadata)

      if (response.id) {
        savedId = response.id
      } else {
        addNotification({
          message: 'Error creating template',
          variant: 'danger'
        })

        errorLogger('Error creating template', 'TemplateForm: createTemplate')
      }

      setSaveLoading(false)
    } else {
      const response = await updateTemplate(providerId, token, ummMetadata, id)

      if (response.ok) {
        addNotification({
          message: 'Template saved successfully',
          variant: 'success'
        })
      } else {
        addNotification({
          message: 'Error saving template',
          variant: 'danger'
        })

        errorLogger('Error saving template', 'TemplateForm: updateTemplate')
      }

      setSaveLoading(false)
    }

    if (type === saveTypes.save) {
      if (currentSection) navigate(`/templates/collections/${savedId || id}/${currentSection}`, { replace: true })

      window.scroll(0, 0)
    }

    if (type === saveTypes.saveAndContinue) {
      const nextFormName = getNextFormName(collectionsTemplateConfiguration, currentSection)

      navigate(`/templates/collections/${savedId || id}/${toLowerKebabCase(nextFormName)}`)

      window.scroll(0, 0)
    }

    if (type === saveTypes.saveAndCreateDraft) {
      const nativeId = `MMT_${crypto.randomUUID()}`

      delete ummMetadata.TemplateName

      ingestMutation('Collection', ummMetadata, nativeId, providerId)
    }

    if (type === saveTypes.saveAndPreview) {
      window.scroll(0, 0)
      navigate(`/templates/collections/${id || savedId}`)
    }
  }

  useEffect(() => {
    if (ingestDraft) {
      const { ingestDraft: fetchedIngestDraft } = ingestDraft
      const { conceptId } = fetchedIngestDraft

      setLoading(false)
      navigate(`/drafts/collections/${conceptId}`)
      addNotification({
        message: 'Draft Created Successfully',
        variant: 'success'
      })
    }

    if (ingestDraftError) {
      setLoading(false)
      errorLogger('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
      addNotification({
        message: 'Error removing collection association ',
        variant: 'danger'
      })
    }
  }, [ingestLoading])

  // Handle the cancel button. Reset the form to the last time we fetched the draft from CMR
  const handleCancel = () => {
    setDraft(originalDraft)
    setVisitedFields([])
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
