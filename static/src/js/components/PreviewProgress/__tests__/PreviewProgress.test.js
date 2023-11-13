import React from 'react'
import { render } from '@testing-library/react'
import validator from '@rjsf/validator-ajv8'

import PreviewProgress from '../PreviewProgress'
import ProgressSection from '../../ProgressSection/ProgressSection'

import testSchema from './__mocks__/schema'
import testConfiguration from './__mocks__/configuration'

jest.mock('../../ProgressSection/ProgressSection')

const setup = () => {
  const draftJson = {
    Name: 'Test name',
    Description: 'test description',
    Version: 'really long version name that should be invalid',
    RelatedURLs: [{
      URL: 'http://example.com'
    }]
  }
  const schema = testSchema
  const sections = testConfiguration
  const { errors: validationErrors } = validator.validateFormData(draftJson, schema)

  render(
    <PreviewProgress
      draftJson={draftJson}
      schema={schema}
      sections={sections}
      validationErrors={validationErrors}
    />
  )
}

describe('PreviewProgress', () => {
  test('renders ProgressSection components', () => {
    setup()

    expect(ProgressSection).toHaveBeenCalledTimes(4)
    expect(ProgressSection.mock.calls[0][0]).toEqual({
      displayName: 'Information',
      fields: [{
        fieldName: 'Name',
        formName: 'Information',
        isRequired: true,
        message: 'Name',
        status: 'Pass'
      }, {
        fieldName: 'LongName',
        formName: 'Information',
        isRequired: true,
        message: 'LongName',
        status: 'Not Started'
      }],
      status: 'Error'
    }, {})

    expect(ProgressSection.mock.calls[1][0]).toEqual({
      displayName: 'Version',
      fields: [{
        fieldName: 'Version',
        formName: 'Version',
        isRequired: true,
        message: 'Version - must NOT have more than 20 characters',
        status: 'Error'
      }],
      status: 'Error'
    }, {})

    expect(ProgressSection.mock.calls[2][0]).toEqual({
      displayName: 'Description',
      fields: [{
        fieldName: 'Description',
        formName: 'Description',
        isRequired: false,
        message: 'Description',
        status: 'Pass'
      }],
      status: 'Pass'
    }, {})

    expect(ProgressSection.mock.calls[3][0]).toEqual({
      displayName: 'RelatedURLs',
      fields: [{
        fieldName: 'RelatedURLs',
        formName: 'RelatedURLs',
        isRequired: false,
        message: 'RelatedURLs',
        status: 'Pass'
      }],
      status: 'Error'
    }, {})
  })
})
