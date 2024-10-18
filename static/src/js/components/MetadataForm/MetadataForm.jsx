import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { kebabCase } from 'lodash-es'
import validator from '@rjsf/validator-ajv8'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from '@rjsf/core'
import Row from 'react-bootstrap/Row'
import pluralize from 'pluralize'

import BoundingRectangleField from '@/js/components/BoundingRectangleField/BoundingRectangleField'
import CustomArrayTemplate from '@/js/components/CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomCountrySelectWidget from '@/js/components/CustomCountrySelectWidget/CustomCountrySelectWidget'
import CustomDateTimeWidget from '@/js/components/CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomRadioWidget from '@/js/components/CustomRadioWidget/CustomRadioWidget'
import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextareaWidget from '@/js/components/CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import CustomTitleFieldTemplate from '@/js/components/CustomTitleFieldTemplate/CustomTitleFieldTemplate'
import FormNavigation from '@/js/components/FormNavigation/FormNavigation'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import JsonPreview from '@/js/components/JsonPreview/JsonPreview'
import KeywordPicker from '@/js/components/KeywordPicker/KeywordPicker'
import OneOfField from '@/js/components/OneOfField/OneOfField'
import StreetAddressField from '@/js/components/StreetAddressField/StreetAddressField'

import formConfigurations from '@/js/schemas/uiForms'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'
import saveTypes from '@/js/constants/saveTypes'
import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'

import useAppContext from '@/js/hooks/useAppContext'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { INGEST_DRAFT } from '@/js/operations/mutations/ingestDraft'

import errorLogger from '@/js/utils/errorLogger'
import getConceptTypeByDraftConceptId from '@/js/utils/getConceptTypeByDraftConceptId'
import getFormSchema from '@/js/utils/getFormSchema'
import getNextFormName from '@/js/utils/getNextFormName'
import getUiSchema from '@/js/utils/getUiSchema'
import getUmmSchema from '@/js/utils/getUmmSchema'
import removeEmpty from '@/js/utils/removeEmpty'
import toKebabCase from '@/js/utils/toKebabCase'

import usePublishMutation from '@/js/hooks/usePublishMutation'

import './MetadataForm.scss'

const MetadataForm = () => {
  const {
    conceptId = 'new',
    draftType,
    fieldName,
    sectionName
  } = useParams()
  const navigate = useNavigate()
  const {
    draft,
    originalDraft,
    providerId,
    revisionId: appContextRevisionId,
    setDraft,
    setOriginalDraft,
    setRevisionId,
    setSavedDraft
  } = useAppContext()

  const { addNotification } = useNotificationsContext()
  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeStringMap[draftType]
  }

  const {
    publishMutation,
    publishDraft,
    error: publishDraftError
  } = usePublishMutation(pluralize(derivedConceptType).toLowerCase())

  useEffect(() => {
    if (conceptId === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [conceptId])

  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)

  // On load, set the focused field and redirect if a field name was present
  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    if (fieldName) setFocusField(fieldName)

    // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
    if (fieldName && sectionName) navigate(`/drafts/${draftType}/${conceptId}/${sectionName}`, { replace: true })
  }, [])

  const [ingestDraftMutation, {
    loading: ingestDraftLoading
  }] = useMutation(INGEST_DRAFT, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of drafts from the cache. This ensures that if the user returns to the list page they will see the correct data.
          drafts: () => {},
          draft(existingDraftsRef, { DELETE }) {
            const { __ref: draftRef = '' } = existingDraftsRef

            // If the ref includes this conceptId, delete it to force a refetch of the data
            if (draftRef.includes(conceptId)) {
              return DELETE
            }

            return existingDraftsRef
          }

        }
      })
    }
  })

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  useEffect(() => {
    const { draft: fetchedDraft } = data || {}
    const { revisionId: cmrRetrievedRevisionId } = fetchedDraft || ''

    if (cmrRetrievedRevisionId && (cmrRetrievedRevisionId !== appContextRevisionId)) {
      addNotification({
        message: 'Delay Detected',
        variant: 'danger'
      })
      
      // Send the error to the errorLogger
      errorLogger('A delay has been detected in CMR', 'MetadataForm: retrieveDraftUseEffect')
    }

    setOriginalDraft(fetchedDraft)
    setDraft(fetchedDraft)
    
  }, [data])

  const {
    nativeId = `MMT_${crypto.randomUUID()}`,
    providerId: fetchedMetadataProviderId,
    ummMetadata = {}
  } = draft || {}

  const schema = getUmmSchema(derivedConceptType)
  const formSections = formConfigurations[derivedConceptType]
  const [firstFormSection] = formSections
  const firstSectionName = kebabCase(firstFormSection.displayName)
  const currentSection = sectionName || firstSectionName
  const uiSchemaType = getUiSchema(derivedConceptType)
  const uiSchema = uiSchemaType[currentSection] || {}

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: schema,
    formConfigurations: formSections,
    formName: currentSection
  })

  const fields = {
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
    ArrayFieldTemplate: CustomArrayTemplate,
    FieldTemplate: CustomFieldTemplate,
    TitleFieldTemplate: CustomTitleFieldTemplate
  }

  const handleSave = (type) => {
    // Save the draft
    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: removeEmpty(ummMetadata),
        nativeId,
        providerId: fetchedMetadataProviderId || providerId,
        // TODO pull this version number from a config
        ummVersion: '1.0.0'
      },
      onCompleted: (mutationData) => {
        const { ingestDraft } = mutationData
        const { conceptId: savedConceptId, revisionId: savedRevisionId } = ingestDraft

        // Update the original draft with the newly saved draft
        setOriginalDraft({
          ...draft,
          name: ummMetadata.Name || ummMetadata.ShortName,
          longName: ummMetadata.LongName || ummMetadata.EntryTitle
        })

        // Update the name and longname with the ummMetadata
        setDraft({
          ...draft,
          name: ummMetadata.Name || ummMetadata.ShortName,
          longName: ummMetadata.LongName || ummMetadata.EntryTitle
        })

        // Set savedDraft so the preview page can request the correct version
        setSavedDraft(ingestDraft)

        // Triggers useEffect for newest revision (CMR Lag related)
        setRevisionId(savedRevisionId)

        // Add a success notification
        addNotification({
          message: 'Draft saved successfully',
          variant: 'success'
        })

        if (type === saveTypes.save) {
          // Navigate to current form? just scroll to top of page instead?

          if (currentSection) navigate(`/drafts/${draftType}/${savedConceptId}/${currentSection}`, { replace: true })

          window.scroll(0, 0)
        }

        if (type === saveTypes.saveAndContinue) {
          // Navigate to next form (using formSections), maybe scroll top too
          const nextFormName = getNextFormName(formSections, currentSection)
          navigate(`/drafts/${draftType}/${savedConceptId}/${toKebabCase(nextFormName)}`)

          window.scroll(0, 0)
        }

        if (type === saveTypes.saveAndPreview) {
          // Navigate to preview page
          window.scroll(0, 0)
          navigate(`/drafts/${draftType}/${savedConceptId}`)
        }

        if (type === saveTypes.saveAndPublish) {
          publishMutation(derivedConceptType, nativeId)
        }
      },
      onError: (ingestError) => {
        // Add an error notification
        addNotification({
          message: 'Error saving draft',
          variant: 'danger'
        })

        // Send the error to the errorLogger
        errorLogger(ingestError, 'MetadataForm: ingestDraftMutation')
      }
    })
  }

  useEffect(() => {
    if (publishDraft) {
      const { conceptId: publishConceptId } = publishDraft

      addNotification({
        message: `${publishConceptId} Published`,
        variant: 'success'
      })

      navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${publishConceptId}`)
    }

    if (publishDraftError) {
      const { message } = publishDraftError
      const parseErr = message.split(',')
      parseErr.map((err) => (
        addNotification({
          message: err,
          variant: 'danger'
        })
      ))

      errorLogger(message, 'PublishMutation: publishMutation')
    }
  }, [publishDraft, publishDraftError])

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

  return (
    <Container className="metadata-form__container mx-0" fluid>
      <Row className="metadata-form__row">
        <Col
          className="mb-5"
          xs="auto"
          md={
            {
              span: 5,
              order: 2
            }
          }
          lg={
            {
              span: 4,
              order: 2
            }
          }
        >
          <div className="metadata-form__navigation sticky-top p-0 ps-md-3 ps-lg-5 top-0 pt-md-3">
            <FormNavigation
              draft={ummMetadata}
              formSections={formSections}
              loading={ingestDraftLoading}
              onCancel={handleCancel}
              onSave={handleSave}
              schema={schema}
              setFocusField={setFocusField}
              visitedFields={visitedFields}
            />
          </div>
        </Col>
        <Col
          xs="auto"
          md={
            {
              span: 7,
              order: 1
            }
          }
          lg={
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
            uiSchema={uiSchema}
            validator={validator}
            widgets={widgets}
          >
            {/* Pass an empty fragment as a child to hide the submit button */}
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <></>
          </Form>
        </Col>
      </Row>

      <Row className="json-view">
        <Col sm={8}>
          <JsonPreview />
        </Col>
      </Row>
    </Container>
  )
}

export default MetadataForm
