import React from 'react'
import PropTypes from 'prop-types'

import For from '../For/For'

import prefixProperty from '../../utils/prefixProperty'
import progressCircleTypes from '../../constants/progressCircleTypes'
import createPath from '../../utils/createPath'
import ProgressSection from '../ProgressSection/ProgressSection'

import './PreviewProgress.scss'

/**
 * @typedef {Object} PreviewProgressProps
 * @property {Object} draftJson UMM JSON of the draft being previewed.
 * @property {Object} schema UMM Schema for the draft being previewed.
 * @property {Array} sections Form section configuration for the draft.
 * @property {Array} validationErrors Validation errors in the draftJson.
 */

/**
 * Renders a PreviewProgress component
 *
 * @component
 * @example <caption>Render a PreviewProgress</caption>
 * return (
 *   <PreviewProgress
 *      draftJson={draftJson}
 *      schema={schema}
 *      sections={sections}
 *      validationErrors={validationErrors}
 *   />
 * )
 */
const PreviewProgress = ({
  draftJson,
  schema,
  sections,
  validationErrors
}) => {
  const isFieldRequired = (name) => {
    const { required } = schema

    return (
      Array.isArray(required) && required.includes(name)
    )
  }

  // Determine the circle type for the form section
  const sectionCircleType = (section) => {
    const { properties } = section

    // If the property of any of the validation errors matches any of the
    // given section's field names, the section has an error
    const hasError = validationErrors.some((error) => {
      const { property: errorProperty } = error
      const prefixedErrorProperty = prefixProperty(errorProperty)

      return properties.some((fieldName) => {
        const prefixedFieldName = prefixProperty(fieldName)

        return prefixedErrorProperty.startsWith(prefixedFieldName)
      })
    })

    if (hasError) {
      return progressCircleTypes.Error
    }

    return progressCircleTypes.Pass
  }

  // Build the field progress for a non-array field
  const buildFieldProgress = ({
    fieldIndex,
    fieldName,
    fieldValue,
    isRequired,
    section
  }) => {
    const prefixedFieldName = prefixProperty(fieldName)
    const { displayName: formName } = section

    // Find errors related to the given `fieldName`
    const errorList = validationErrors.filter((error) => {
      const { property } = error
      const path = createPath(property)
      const regexp = /^[^[]+\[(\d+)\].*/
      const match = path.match(regexp)

      let indexMatched = true

      if (match) {
        const matchedIndex = Number(match[1])

        indexMatched = fieldIndex && matchedIndex === fieldIndex
      }

      return prefixProperty(property).startsWith(prefixedFieldName) && indexMatched
    })

    // If no errors exist and no `fieldValue` exists, the status will be `NotStarted`
    let status = progressCircleTypes.NotStarted
    let message = fieldName

    if (errorList.length > 0 && fieldValue) {
      // If there are errors, set the status to `Error` and build a message to show the user
      status = progressCircleTypes.Error

      const [error] = errorList

      const { message: errorMessage } = error

      message = `${fieldName} - ${errorMessage}`
    } else if (fieldValue) {
      // If there is a `fieldValue` and no errors the status is `Pass`
      status = progressCircleTypes.Pass
    }

    return {
      fieldName,
      formName,
      isRequired,
      message,
      status
    }
  }

  // Build the field progress for an array field
  // Loop through each value in the array and call `buildFieldProgress` for each
  const buildFieldsProgress = ({
    fieldName,
    fieldValue,
    isRequired,
    section
  }) => fieldValue.map((value, index) => buildFieldProgress({
    fieldIndex: index,
    fieldName,
    fieldValue: value,
    isRequired,
    section
  }))

  // Generate the progress circles for each field in a form section
  const fieldsProgressForSection = (section) => {
    const { properties } = section
    const fields = []

    properties.forEach((fieldName) => {
      const fieldValue = draftJson[fieldName]
      const required = isFieldRequired(fieldName)

      if (Array.isArray(fieldValue)) {
        fields.push(...buildFieldsProgress({
          fieldName,
          fieldValue,
          isRequired: required,
          section
        }))
      } else {
        fields.push(buildFieldProgress({
          fieldName,
          fieldValue,
          isRequired: required,
          section
        }))
      }
    })

    return fields
  }

  return (
    <div className="preview-progress__container">
      <For each={sections}>
        {
          (section) => {
            const { displayName } = section
            const status = sectionCircleType(section)
            const fields = fieldsProgressForSection(section, draftJson)

            return (
              <ProgressSection
                displayName={displayName}
                fields={fields}
                key={displayName}
                status={status}
              />
            )
          }
        }
      </For>
    </div>
  )
}

PreviewProgress.propTypes = {
  draftJson: PropTypes.shape({}).isRequired,
  schema: PropTypes.shape({
    required: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  validationErrors: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired
}

export default PreviewProgress
