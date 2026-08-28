import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import JSONPretty from 'react-json-pretty'
import { cloneDeep } from 'lodash-es'
import PropTypes from 'prop-types'
import validator from '@rjsf/validator-ajv8'

import useAppContext from '../../hooks/useAppContext'
import removeEmpty from '../../utils/removeEmpty'
import Button from '../Button/Button'

const JsonPreview = ({ schema }) => {
  const {
    draft = {},
    setDraft
  } = useAppContext()

  const { ummMetadata = {} } = draft || {}

  const data = cloneDeep(removeEmpty(ummMetadata))

  const [isEditing, setIsEditing] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [errors, setErrors] = useState([])
  // Snapshot of `data` (as a JSON string) taken the moment we entered edit
  // mode. Used to detect if the draft changed out from under us while the
  // textarea was open (e.g. the UI form was edited concurrently), so we
  // know our buffer is stale relative to the source of truth.
  const [editingSnapshot, setEditingSnapshot] = useState(null)

  // Keep the buffer in sync with the draft whenever we're not actively
  // editing (e.g. the form itself changed a field). If we ARE editing and
  // the draft changes anyway (e.g. the UI form was edited/saved
  // concurrently), our buffer is now stale relative to the source of
  // truth -- bail out of edit mode rather than let a later Save overwrite
  // the newer data with our stale copy.
  useEffect(() => {
    if (!isEditing) {
      setJsonText(JSON.stringify(data, null, 2))

      return
    }

    if (editingSnapshot !== null && JSON.stringify(data) !== editingSnapshot) {
      setIsEditing(false)
      setErrors([])
    }
  }, [data, isEditing, editingSnapshot])

  const handleEditClick = () => {
    setJsonText(JSON.stringify(data, null, 2))
    // Compact form here, to match the compact JSON.stringify(data) used for
    // comparison in the effect above -- the two need the same formatting or
    // they'll never compare equal, even when the underlying data hasn't
    // changed.
    setEditingSnapshot(JSON.stringify(data))
    setErrors([])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setErrors([])
    setIsEditing(false)
  }

  const handleTextChange = (event) => {
    setJsonText(event.target.value)
    if (errors.length > 0) setErrors([])
  }

  const handleSave = () => {
    let parsed

    try {
      parsed = JSON.parse(jsonText)
    } catch (parseError) {
      setErrors([`Invalid JSON: ${parseError.message}`])

      return
    }

    if (schema) {
      const { errors: schemaErrors = [] } = validator.validateFormData(parsed, schema)

      // Only block on structural problems (an unknown/typo'd field name, or a
      // value of the wrong type). Missing-required-field errors are ignored
      // here so saving through the JSON editor stays as permissive as saving
      // through the form fields, which never blocks on incomplete drafts.
      // A missing required field inside a oneOf/anyOf branch (e.g. a
      // discriminated union) doesn't just produce a 'required' error -- AJV
      // also emits a wrapping 'oneOf'/'anyOf' error at the parent level
      // ("must match a schema in oneOf/anyOf"), so those need to be ignored
      // too or an otherwise-incomplete-but-valid draft would still be blocked.
      const structuralErrors = schemaErrors.filter(
        ({ name }) => !['required', 'oneOf', 'anyOf'].includes(name)
      )

      if (structuralErrors.length > 0) {
        setErrors(structuralErrors.map(({
          name,
          property,
          message,
          params
        }) => {
          // AJV puts the actual bad key in params.additionalProperty for this
          // error type -- `property` here refers to the parent object, and
          // `message` alone doesn't name the offending field at all.
          if (name === 'additionalProperties' && params?.additionalProperty) {
            const location = property ? `${property} ` : ''

            return `${location}must NOT have additional property '${params.additionalProperty}'`
          }

          return property ? `${property} ${message}` : message
        }))

        return
      }
    }

    setDraft({
      ...draft,
      ummMetadata: parsed
    })

    setErrors([])
    setIsEditing(false)
  }

  return (
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
            {
              isEditing
                ? (
                  <>
                    <Button
                      className="me-2"
                      variant="secondary"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </>
                )
                : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleEditClick}
                  >
                    Edit JSON
                  </Button>
                )
            }
          </div>

          {
            errors.length > 0 && (
              <div className="text-danger small mb-2" role="alert">
                {
                  errors.length === 1
                    ? errors[0]
                    : (
                      <ul className="mb-0 ps-3">
                        {
                          errors.map((message) => (
                            <li key={message}>{message}</li>
                          ))
                        }
                      </ul>
                    )
                }
              </div>
            )
          }

          {
            isEditing
              ? (
                <textarea
                  className={`form-control font-monospace ${errors.length > 0 ? 'is-invalid' : ''}`}
                  rows={20}
                  value={jsonText}
                  onChange={handleTextChange}
                  spellCheck={false}
                  aria-label="Editable JSON metadata"
                />
              )
              : <JSONPretty data={data} />
          }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
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
