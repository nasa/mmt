import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import { kebabCase } from 'lodash-es'
import validator from '@rjsf/validator-ajv8'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from '@rjsf/core'
import Row from 'react-bootstrap/Row'

import pluralize from 'pluralize'
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
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import FormNavigation from '../FormNavigation/FormNavigation'
import GridLayout from '../GridLayout/GridLayout'
import JsonPreview from '../JsonPreview/JsonPreview'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'
import StreetAddressField from '../StreetAddressField/StreetAddressField'
import OneOfField from '../OneOfField/OneOfField'

import formConfigurations from '../../schemas/uiForms'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import saveTypes from '../../constants/saveTypes'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'

import errorLogger from '../../utils/errorLogger'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getFormSchema from '../../utils/getFormSchema'
import getNextFormName from '../../utils/getNextFormName'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import getUiSchema from '../../utils/getUiSchema'

import './MetadataForm.scss'
import removeEmpty from '../../utils/removeEmpty'
import usePublishMutation from '../../hooks/usePublishMutation'

const MetadataForm = () => {
  const {
    conceptId = 'new',
    sectionName,
    fieldName,
    draftType
  } = useParams()
  const navigate = useNavigate()
  const {
    draft,
    originalDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  } = useAppContext()

  const { providerId } = user
  const { addNotification } = useNotificationsContext()
  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeMap[draftType]
  }

  const {
    publishMutation,
    publishDraft,
    error: publishDraftError,
    loading: publishDraftLoading = true
  } = usePublishMutation()

  useEffect(() => {
    if (conceptId === 'new') {
      setDraft({})
      setOriginalDraft({})
    }
  }, [conceptId])

  const [visitedFields, setVisitedFields] = useState([])
  const [focusField, setFocusField] = useState(null)

  useEffect(() => {
    // If fieldName was pulled from the URL, set it to the focusField
    setFocusField(fieldName)

    // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
    if (fieldName && sectionName) navigate(`../${conceptId}/${sectionName}`, { replace: true })
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

      setOriginalDraft(fetchedDraft)
      setDraft(fetchedDraft)
    }
  })

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
  const uiSchemaType = getUiSchema(derivedConceptType)
  const uiSchema = uiSchemaType[currentSection] || {}

  // Limit the schema to only the fields present in the displayed form section
  const formSchema = getFormSchema({
    fullSchema: schema,
    formConfigurations: formSections,
    formName: currentSection
  })

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
    ArrayFieldTemplate: CustomArrayTemplate,
    // DescriptionFieldTemplate: CustomDescriptionFieldTemplate,
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
        providerId,
        // TODO pull this version number from a config
        ummVersion: '1.0.0'
      },
      onCompleted: (mutationData) => {
        const { ingestDraft } = mutationData
        const { conceptId: savedConceptId } = ingestDraft

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

        // Add a success notification
        addNotification({
          message: 'Draft saved successfully',
          variant: 'success'
        })

        if (type === saveTypes.save) {
          // Navigate to current form? just scroll to top of page instead?

          if (currentSection) navigate(`../${savedConceptId}/${currentSection}`, { replace: true })

          window.scroll(0, 0)
        }

        if (type === saveTypes.saveAndContinue) {
          // Navigate to next form (using formSections), maybe scroll top too
          const nextFormName = getNextFormName(formSections, currentSection)
          navigate(`../${savedConceptId}/${toLowerKebabCase(nextFormName)}`)

          window.scroll(0, 0)
        }

        if (type === saveTypes.saveAndPreview) {
          // Clear out the draft and originalDraft so that the preview page will refetch the draft
          // setDraft()
          // setOriginalDraft()

          // Navigate to preview page
          window.scroll(0, 0)
          navigate(`../${savedConceptId}`)
        }

        if (type === saveTypes.saveAndPublish) {
          if (derivedConceptType === 'Variable') {
            const { _private } = ummMetadata
            const { CollectionAssociation } = _private
            const { collectionConceptId } = CollectionAssociation
            publishMutation(derivedConceptType, nativeId, collectionConceptId)
          } else {
            publishMutation(derivedConceptType, nativeId)
          }
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
      const { conceptId: publishConceptId, revisionId } = publishDraft

      addNotification({
        message: `${publishConceptId} Published`,
        variant: 'success'
      })

      navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${publishConceptId}/${revisionId}`)
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
  }, [publishDraftLoading, publishDraftError])

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

  const name = draft?.name || draft?.ummMetadata?.ShortName || '<Blank Name>'
  const pageTitle = conceptId === 'new' ? `New ${derivedConceptType} Draft` : `Edit ${name}`

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
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${draftType}`
          },
          (
            conceptId !== 'new' && {
              label: name,
              to: `/drafts/${draftType}/${conceptId}`
            }
          ),
          {
            label: pageTitle,
            active: true
          }
        ]
      }
    >
      <Container className="metadata-form__container mx-0">
        <Row className="metadata-form__row">
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
            <div className="metadata-form__navigation sticky-top p-0 ps-md-3 ps-lg-5 top-0 pt-md-3">
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
                uiSchema={uiSchema}
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
    </Page>
  )
}

export default MetadataForm
