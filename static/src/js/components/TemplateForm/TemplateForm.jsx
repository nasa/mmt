import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { isEmpty, kebabCase } from 'lodash-es'

import useAppContext from '@/js/hooks/useAppContext'

import collectionsTemplateConfiguration from '@/js/schemas/uiForms/collectionTemplatesConfiguration'
import collectionsUiSchema from '@/js/schemas/uiSchemas/collections'
import ummCTemplateSchema from '@/js/schemas/umm/ummCTemplateSchema'

import BoundingRectangleField from '@/js/components/BoundingRectangleField/BoundingRectangleField'
import CustomArrayFieldTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomCountrySelectWidget from '@/js/components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '@/js/components/CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomRadioWidget from '@/js/components/CustomRadioWidget/CustomRadioWidget'
import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '@/js/components/CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import ErrorBanner from '@/js/components/ErrorBanner/ErrorBanner'
import FormNavigation from '@/js/components/FormNavigation/FormNavigation'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import JsonPreview from '@/js/components/JsonPreview/JsonPreview'
import KeywordPicker from '@/js/components/KeywordPicker/KeywordPicker'
import LoadingBanner from '@/js/components/LoadingBanner/LoadingBanner'
import OneOfField from '@/js/components/OneOfField/OneOfField'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import StreetAddressField from '@/js/components/StreetAddressField/StreetAddressField'

import createTemplate from '@/js/utils/createTemplate'
import errorLogger from '@/js/utils/errorLogger'
import getFormSchema from '@/js/utils/getFormSchema'
import getNextFormName from '@/js/utils/getNextFormName'
import getTemplate from '@/js/utils/getTemplate'
import parseError from '@/js/utils/parseError'
import removeEmpty from '@/js/utils/removeEmpty'
import toKebabCase from '@/js/utils/toKebabCase'
import updateTemplate from '@/js/utils/updateTemplate'

import useIngestDraftMutation from '@/js/hooks/useIngestDraftMutation'
import useMMTCookie from '@/js/hooks/useMMTCookie'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import saveTypes from '@/js/constants/saveTypes'

const TemplateForm = () => {
  const {
    id = 'new',
    sectionName,
    fieldName
  } = useParams()

  const navigate = useNavigate()

  const {
    draft = {},
    originalDraft,
    providerId,
    setDraft,
    setOriginalDraft,
    setProviderId
  } = useAppContext()

  const { mmtJwt } = useMMTCookie()

  const {
    ingestMutation,
    ingestDraft,
    error: ingestDraftError
  } = useIngestDraftMutation()

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
  const { ummMetadata = {} } = draft

  const [firstFormSection] = collectionsTemplateConfiguration
  const firstSectionName = kebabCase(firstFormSection.displayName)
  const currentSection = sectionName || firstSectionName

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: ummCTemplateSchema,
    formConfigurations: collectionsTemplateConfiguration,
    formName: currentSection
  })

  // On load, set the focused field and redirect if a field name was present
  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    if (fieldName) setFocusField(fieldName)

    // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
    if (fieldName && sectionName) navigate(`/templates/collections/${id}/${sectionName}`, { replace: true })
  }, [])

  // On load, fetching collection template if ID is present and draft is not loaded
  useEffect(() => {
    const fetchTemplate = async () => {
      const { response, error: fetchTemplateError } = await getTemplate(mmtJwt, id)

      if (response) {
        const { template, providerId: fetchedProviderId } = response

        setProviderId(fetchedProviderId)
        setDraft({
          ummMetadata: template
        })

        setOriginalDraft({
          ummMetadata: template
        })
      } else { setErrors(fetchTemplateError) }

      setLoading(false)
    }

    if (id !== 'new' && isEmpty(draft)) {
      setLoading(true)
      fetchTemplate()
    }

    if (id === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [])

  const handleSave = async (type) => {
    setSaveLoading(true)

    let savedId = null
    if (id === 'new') {
      const response = await createTemplate(providerId, mmtJwt, removeEmpty(ummMetadata))

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
      const response = await updateTemplate(providerId, mmtJwt, removeEmpty(ummMetadata), id)

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

      navigate(`/templates/collections/${savedId || id}/${toKebabCase(nextFormName)}`)

      window.scroll(0, 0)
    }

    if (type === saveTypes.saveAndCreateDraft) {
      const nativeId = `MMT_${crypto.randomUUID()}`

      delete ummMetadata.TemplateName

      ingestMutation('Collection', ummMetadata, nativeId, providerId)
    }

    if (type === saveTypes.saveAndPreview) {
      window.scroll(0, 0)
      navigate(`/templates/collections/${savedId || id}`)
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
      const { message } = ingestDraftError
      setLoading(false)
      errorLogger(ingestDraftError, 'TemplateForm: ingestDraft Mutation')
      addNotification({
        message: `Error creating draft: ${message}`,
        variant: 'danger'
      })
    }
  }, [ingestDraft, ingestDraftError])

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

  const templateFormPageHeader = () => (
    <PageHeader
      title={pageTitle}
      titleBadge={id === 'new' ? null : providerId}
      breadcrumbs={
        [
          {
            label: 'Templates',
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
      pageType="secondary"
    />
  )

  if (loading) {
    return (
      <LoadingBanner />
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <ErrorBanner message={message} />
    )
  }

  return (
    <Page
      header={templateFormPageHeader()}
    >
      <Container className="template-form__container mx-0" fluid>
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
                formSections={collectionsTemplateConfiguration}
                loading={saveLoading}
                onCancel={handleCancel}
                onSave={handleSave}
                schema={ummCTemplateSchema}
                setFocusField={setFocusField}
                visitedFields={visitedFields}
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
