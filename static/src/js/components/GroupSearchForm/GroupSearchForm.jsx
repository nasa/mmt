import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useSuspenseQuery } from '@apollo/client'
import { isNil, omitBy } from 'lodash-es'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'

import { GET_PROVIDERS } from '@/js/operations/queries/getProviders'

import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import CustomTextareaWidget from '../CustomTextareaWidget/CustomTextareaWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'

import groupSearch from '../../schemas/groupSearch'
import groupSearchUiSchema from '../../schemas/uiSchemas/GroupSearch'

import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate/CustomArrayFieldTemplate'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'

/**
 * Renders a GroupSearchForm component
 *
 * @component
 * @example <caption>Render a GroupSearchForm</caption>
 * return (
 *   <GroupSearchForm />
 * )
 */
const GroupSearchForm = () => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const searchName = searchParams.get('name') || ''
  const searchProviders = searchParams.get('providers') || undefined
  const encodedMembers = searchParams.get('members') || ''
  const decodedMembers = Buffer.from(encodedMembers, 'base64').toString() || '[]'
  const searchMembers = JSON.parse(decodedMembers)

  const [formData, setFormData] = useState({
    name: searchName || '',
    members: searchMembers || [],
    providers: searchProviders?.split(',')
  })

  const { data: providersData } = useSuspenseQuery(GET_PROVIDERS)
  const updatedGroupsSchema = groupSearch
  updatedGroupsSchema.properties.providers.items.enum = providersData?.providers.items?.map(
    (provider) => provider.providerId
  )

  // Handle form changes
  const handleChange = (event) => {
    const { formData: newFormData } = event

    setFormData(newFormData)
  }

  // Callback for submitting the search form
  const onSearchSubmit = () => {
    // Default these parameters to undefined to keep empty parameters out of the URL
    const allParams = {
      members: formData.members.length > 0
        ? Buffer.from(JSON.stringify(formData.members)).toString('base64')
        : undefined,
      name: formData.name || undefined,
      providers: formData.providers?.join(',') || undefined
    }

    // Remove any null search params
    const prunedParams = omitBy(allParams, isNil)

    const params = new URLSearchParams(prunedParams)

    // Navigate to the search params with any of the defined params in the url
    navigate(`/groups?${params.toString()}`)
  }

  const fields = {
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    SelectWidget: CustomSelectWidget,
    TextareaWidget: CustomTextareaWidget
  }

  const templates = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate
  }

  return (
    <Container className="group-form__container mx-0" fluid>
      <Row>
        <Col>
          <Form
            fields={fields}
            formContext={
              {
                focusField: null,
                setFocusField: () => {}
              }
            }
            widgets={widgets}
            schema={groupSearch}
            validator={validator}
            templates={templates}
            uiSchema={groupSearchUiSchema}
            onChange={handleChange}
            formData={formData}
            onSubmit={onSearchSubmit}
            showErrorList="false"
          >
            <div className="d-flex gap-2">
              <Button type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupSearchForm
