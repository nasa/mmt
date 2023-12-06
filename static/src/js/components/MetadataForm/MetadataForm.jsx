import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import { kebabCase } from 'lodash'
import validator from '@rjsf/validator-ajv8'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from '@rjsf/core'
import Row from 'react-bootstrap/Row'

import BoundingRectangleField from '../BoundingRectangleField/BoundingRectangleField'
import CustomArrayTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
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
import JsonPreview from '../JsonPreview/JsonPreview'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import StreetAddressField from '../StreetAddressField/StreetAddressField'

import ErrorBanner from '../ErrorBanner/ErrorBanner'
import FormNavigation from '../FormNavigation/FormNavigation'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

import formConfigurations from '../../schemas/uiForms'
import toolsUiSchema from '../../schemas/uiSchemas/tools'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import saveTypes from '../../constants/saveTypes'
import statusMessageTypes from '../../constants/statusMessageTypes'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'

import useAppContext from '../../hooks/useAppContext'

import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'

import errorLogger from '../../utils/errorLogger'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getFormSchema from '../../utils/getFormSchema'
import getNextFormName from '../../utils/getNextFormName'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'
import removeEmpty from '../../utils/removeEmpty'

import './MetadataForm.scss'

const MetadataForm = () => {
  const {
    conceptId = 'new',
    sectionName,
    fieldName,
    draftType
  } = useParams()
  const navigate = useNavigate()
  const {
    user,
    addStatusMessage,
    draft,
    setDraft
  } = useAppContext()

  const { providerId } = user

  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeMap[draftType]
  }

  useEffect(() => {
    if (conceptId === 'new') setDraft({})
  }, [conceptId])

  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)

  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    setFocusField(fieldName)

    // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
    if (sectionName) navigate(`../${conceptId}/${sectionName}`, { replace: true })
  }, [fieldName])

  const [ingestDraftMutation, {
    loading: ingestDraftLoading
  }] = useMutation(INGEST_DRAFT)

  const { loading, error } = useQuery(conceptTypeDraftQueries[derivedConceptType], {
    // If the draft has already been loaded, skip this query
    skip: draft || conceptId === 'new',
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft: fetchedDraft } = getDraftData

      setDraft(fetchedDraft)
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

  const {
    // Name,
    nativeId = `MMT_${crypto.randomUUID()}`,
    ummMetadata = {}
  } = draft || {}

  const schema = getUmmSchema(derivedConceptType)
  const formSections = formConfigurations[derivedConceptType]
  const [firstFormSection] = formSections
  const firstSectionName = kebabCase(firstFormSection.displayName)
  const currentSection = sectionName || firstSectionName
  const uiSchema = toolsUiSchema[currentSection]

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: schema,
    formConfigurations: formSections,
    formName: currentSection
  })

  const fields = {
    layout: GridLayout,
    streetAddresses: StreetAddressField,
    BoundingRectangle: BoundingRectangleField,
    keywordPicker: KeywordPicker,
    TitleField: CustomTitleField
    // OneOfField,
    // AnyOfField: () => null
  }
  const widgets = {
    TextWidget: CustomTextWidget,
    TextareaWidget: CustomTextareaWidget,
    SelectWidget: CustomSelectWidget,
    DateTimeWidget: CustomDateTimeWidget,
    CountrySelectWiget: CustomCountrySelectWidget,
    RadioWidget: CustomRadioWidget,
    CheckboxWidget: CustomRadioWidget
  }
  const templates = {
    // DescriptionFieldTemplate: CustomDescriptionFieldTemplate,
    ArrayFieldTemplate: CustomArrayTemplate,
    FieldTemplate: CustomFieldTemplate,
    TitleFieldTemplate: CustomTitleFieldTemplate
  }

  const handleSave = (type) => {
    // Save the draft
    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: ummMetadata,
        nativeId,
        providerId,
        // TODO pull this version number from a config
        ummVersion: '1.0.0'
      },
      onCompleted: (mutationData) => {
        const { ingestDraft: { conceptId: savedConceptId } } = mutationData
        addStatusMessage({
          id: `${savedConceptId}-saved`,
          message: 'Draft saved successfully',
          type: statusMessageTypes.INFO
        })

        // TODO show a status message
        if (type === saveTypes.save) {
          // Navigate to current form? just scroll to top of page instead?
          if (currentSection) navigate(`../${conceptId}/${currentSection}`, { replace: true })

          window.scroll(0, 0)
        }

        if (type === saveTypes.saveAndContinue) {
          // Navigate to next form (using formSections), maybe scroll top too
          const nextFormName = getNextFormName(formSections, currentSection)
          navigate(`../${savedConceptId}/${kebabCase(nextFormName)}`)
        }

        if (type === saveTypes.saveAndPreview) {
          // Navigate to preview page
          window.scroll(0, 0)
          navigate(`../${savedConceptId}`)
        }

        if (type === saveTypes.saveAndPublish) {
          // Save and then publish?
        }
      },
      onError: (ingestError) => {
        errorLogger(ingestError, 'MetadataForm: ingestDraftMutation')
        // Populate some errors to be displayed
      }
    })
  }

  const handleCancel = () => {
    // TODO this isn't working because we are changing the draft as the form is used
    setDraft(draft)
  }

  // Handle form changes
  const handleChange = (event) => {
    const { formData } = event

    setDraft({
      ...draft,
      ummMetadata: removeEmpty(formData)
    })
  }

  // Handle bluring fields within the form
  const handleBlur = (fieldId) => {
    setVisitedFields([...new Set([
      ...visitedFields,
      fieldId
    ])])
  }

  // TODO use name here
  const pageTitle = conceptId === 'new' ? `New ${derivedConceptType} Draft` : `Edit ${conceptId}`

  return (
    <Page title={pageTitle} pageType="secondary">
      <Container id="metadata-form__container">
        <Row className="sidebar_column">
          <Col sm={8}>
            <Form
              validator={validator}
              schema={formSchema}
              formData={ummMetadata}
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
            />
          </Col>

          <Col sm={4}>
            <div className="metadata-form__navigation sticky-top">
              <FormNavigation
                draft={ummMetadata}
                fullSchema={schema}
                formSections={formSections}
                loading={ingestDraftLoading}
                visitedFields={visitedFields}
                onSave={handleSave}
                onCancel={handleCancel}
                schema={schema}
                setFocusField={setFocusField}
              />
            </div>
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

export default MetadataForm
