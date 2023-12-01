import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import { kebabCase, capitalize } from 'lodash'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import CustomArrayTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import CustomRadioWidget from '../CustomRadioWidget/CustomRadioWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import BoundingRectangleField from '../BoundingRectangleField/BoundingRectangleField'
import CustomCountrySelectWidget from '../CustomCountrySelectWidget/CustomCountrySelectWidget'
import KeywordPicker from '../KeywordPicker/KeywordPicker'

import ErrorBanner from '../ErrorBanner/ErrorBanner'
import FormNavigation from '../FormNavigation/FormNavigation'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

import toolsUiSchema from '../../schemas/uiSchemas/tools'
import formConfigurations from '../../schemas/uiForms'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import saveTypes from '../../constants/saveTypes'
import statusMessageTypes from '../../constants/statusMessageTypes'

import useAppContext from '../../hooks/useAppContext'

import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'

import convertToDottedNotation from '../../utils/convertToDottedNotation'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getFormSchema from '../../utils/getFormSchema'
import getNextFormName from '../../utils/getNextFormName'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'
import removeEmpty from '../../utils/removeEmpty'

import './MetadataForm.scss'
import StreetAddressField from '../StreetAddressField/StreetAddressField'
import JsonPreview from '../JsonPreview/JsonPreview'
import GridLayout from '../GridLayout/GridLayout'
import toolsConfiguration from '../../schemas/uiForms/toolsConfiguration'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'
import errorLogger from '../../utils/errorLogger'

const MetadataForm = () => {
  const {
    conceptId = 'new',
    sectionName,
    fieldName,
    draftType
  } = useParams()
  const navigate = useNavigate()
  const {
    user: {
      providerId
    },
    addStatusMessage,
    draft,
    setDraft
  } = useAppContext()

  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeMap[draftType]
  }

  useEffect(() => {
    if (conceptId === 'new') setDraft({})
  }, [conceptId])

  console.log('🚀 ~ file: MetadataForm.jsx:77 ~ MetadataForm ~ derivedConceptType:', derivedConceptType)

  const [validationErrors, setValidationErrors] = useState([])
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

  console.log('🚀 ~ file: MetadataForm.jsx:100 ~ MetadataForm ~ conceptTypeDraftQueries[derivedConceptType]:', conceptTypeDraftQueries[derivedConceptType])
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
    conceptType,
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
  console.log('S----------------------------S')
  console.log('SCHEMA:', schema)
  console.log('formSections:', formSections)
  console.log('sectionName:', sectionName)
  const formSchema = getFormSchema({
    fullSchema: schema,
    formConfigurations: formSections,
    formName: currentSection
  })
  console.log('formSchema:', formSchema)
  console.log('E-----------------------------E')

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
        console.log('🚀 ~ file: MetadataForm.jsx:149 ~ handleSave ~ mutationData:', mutationData)
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
        console.log('🚀 ~ file: MetadataForm.jsx:175 ~ handleSave ~ ingestError:', ingestError)
        errorLogger(ingestError, 'MetadataForm: ingestDraftMutation')
        // Populate some errors to be displayed
      }
    })
  }

  const handleCancel = () => {
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
    // Add the blurred field into `visitedFields`
    const path = convertToDottedNotation(fieldId.replace('root', ''))

    setVisitedFields([...new Set([
      ...visitedFields,
      path
    ])])
  }

  const pageTitle = conceptId === 'new' ? `New ${derivedConceptType} Draft` : `Edit ${conceptId}`

  return (
    <Page title={pageTitle} pageType="secondary">
      <Container id="metadata-form__container">
        <Row className="sidebar_column">
          <Col sm={8}>
            {/* <MMTForm */}
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
