import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import JSONPretty from 'react-json-pretty'
import { cloneDeep } from 'lodash-es'
import PropTypes from 'prop-types'
import validator from '@rjsf/validator-ajv8'

import useAppContext from '../../hooks/useAppContext'
import removeEmpty from '../../utils/removeEmpty'
import Button from '../Button/Button'
import CustomModal from '../CustomModal/CustomModal'

const JsonPreview = ({ schema }) => {
  const {
    draft = {},
    setDraft
  } = useAppContext()

  const { ummMetadata = {} } = draft || {}

  const data = cloneDeep(removeEmpty(ummMetadata))

  const [isEditing, setIsEditing] = useState(false)
  const [jsonText, setJsonText] = useState('')

  // Inline, blocking error -- only ever a JSON.parse failure.
  const [parseError, setParseError] = useState(null)

  // Schema/structural errors surfaced on Apply. These block saving -- the
  // errors modal below is a dead end that only lets the user go back and
  // fix the JSON, it never commits the invalid draft.
  const [pendingErrors, setPendingErrors] = useState([])
  const [showErrors, setShowErrors] = useState(false)

  const handleEditClick = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setParseError(null)
    setPendingErrors([])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setParseError(null)
    setPendingErrors([])
    setShowErrors(false)
    setIsEditing(false)
  }

  const handleTextChange = (event) => {
    setJsonText(event.target.value)
    if (parseError) setParseError(null)
  }

  const handleApplyClick = () => {
    let parsed

    try {
      parsed = JSON.parse(jsonText)
    } catch (parseErrorObj) {
      setParseError(`Invalid JSON: ${parseErrorObj.message}`)

      return
    }

    setParseError(null)

    if (schema) {
      const { errors: schemaErrors = [] } = validator.validateFormData(parsed, schema)

      // Only surface structural errors (unknown field, wrong type, oneOf/anyOf
      // mismatches). 'required' errors are ignored so the JSON editor stays as
      // permissive as the form.
      const structuralErrors = schemaErrors.filter(({ name }) => name !== 'required')

      if (structuralErrors.length > 0) {
        const messages = structuralErrors.map(({
          name,
          property,
          message,
          params
        }) => {
          // AJV reports the bad key in params.additionalProperty, not in `message`
          if (name === 'additionalProperties' && params?.additionalProperty) {
            const location = property ? `${property} ` : ''

            return `${location} must NOT have additional property '${params.additionalProperty}'`
          }

          return property ? `${property} ${message}` : message
        })

        setPendingErrors(messages)
        setShowErrors(true)

        return
      }
    }

    setDraft({
      ...draft,
      ummMetadata: parsed
    })

    setParseError(null)
    setPendingErrors([])
    setShowErrors(false)
    setIsEditing(false)
  }

  const handleErrorsBack = () => {
    setShowErrors(false)
    setPendingErrors([])
  }

  return (
    <>
      <Accordion
        defaultActiveKey="0"
        className="mt-5"
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            JSON
          </Accordion.Header>
          <Accordion.Body>
            <div className="d-flex justify-content-end mb-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditClick}
              >
                Edit JSON
              </Button>
            </div>

            <JSONPretty data={data} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <CustomModal
        show={isEditing}
        toggleModal={
          (nextShow) => {
            if (!nextShow) handleCancel()
          }
        }
        size="xl"
        header="Editing JSON"
        message={
          (
            <>
              {
                parseError && (
                  <div className="text-danger small mb-2" role="alert">
                    {parseError}
                  </div>
                )
              }

              <textarea
                className={`form-control font-monospace ${parseError ? 'is-invalid' : ''}`}
                rows={32}
                value={jsonText}
                onChange={handleTextChange}
                spellCheck={false}
                aria-label="Editable JSON metadata"
              />
            </>
          )
        }
        actions={
          [
            {
              label: 'Cancel',
              variant: 'secondary',
              onClick: handleCancel
            },
            {
              label: 'Apply',
              variant: 'primary',
              onClick: handleApplyClick
            }
          ]
        }
      />

      <CustomModal
        show={showErrors}
        toggleModal={
          (nextShow) => {
            if (!nextShow) handleErrorsBack()
          }
        }
        size="lg"
        header="Invalid JSON"
        message={
          (
            <>
              <p>Your record has the following errors:</p>

              <ul>
                {
                  pendingErrors.map((message, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={`${index}-${message}`}>{message}</li>
                  ))
                }
              </ul>

              <p>You must fix these errors before proceeding to save.</p>
            </>
          )
        }
        actions={
          [
            {
              label: 'Go Back',
              variant: 'primary',
              onClick: handleErrorsBack
            }
          ]
        }
      />
    </>
  )
}

JsonPreview.defaultProps = {
  schema: null
}

JsonPreview.propTypes = {
  // The full UMM schema (not a section-limited schema) to validate the
  // edited JSON against on save. If omitted, only JSON-syntax validation
  // is performed.
  // eslint-disable-next-line react/forbid-prop-types
  schema: PropTypes.object
}

export default JsonPreview
