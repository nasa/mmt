import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
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

  // Inline, blocking error -- only ever a JSON.parse failure. There's
  // nothing to save yet, so this can't be resolved with a "save anyway"
  // confirmation the way schema errors can.
  const [parseError, setParseError] = useState(null)

  // Schema/structural errors surfaced on Save. These don't block saving --
  // they open the confirmation modal below instead, and the user decides
  // whether to save despite them.
  const [pendingErrors, setPendingErrors] = useState([])
  const [pendingParsed, setPendingParsed] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleEditClick = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setParseError(null)
    setPendingErrors([])
    setPendingParsed(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setParseError(null)
    setPendingErrors([])
    setPendingParsed(null)
    setShowConfirm(false)
    setIsEditing(false)
  }

  const handleTextChange = (event) => {
    setJsonText(event.target.value)
    if (parseError) setParseError(null)
  }

  const commitSave = (parsed) => {
    setDraft({
      ...draft,
      ummMetadata: parsed
    })

    setParseError(null)
    setPendingErrors([])
    setPendingParsed(null)
    setShowConfirm(false)
    setIsEditing(false)
  }

  const handleSaveClick = () => {
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

      // Only surface structural problems (an unknown/typo'd field name, or a
      // value of the wrong type). Missing-required-field errors are ignored
      // here so saving through the JSON editor stays as permissive as saving
      // through the form fields, which never blocks on incomplete drafts.
      // A missing required field inside a oneOf/anyOf branch (e.g. a
      // discriminated union) doesn't just produce a 'required' error -- AJV
      // also emits a wrapping 'oneOf'/'anyOf' error at the same instancePath
      // ("must match a schema in oneOf/anyOf"), so that wrapper needs to be
      // ignored too or an otherwise-incomplete-but-valid draft would still
      // trigger a confirmation.
      //
      // However, oneOf/anyOf errors aren't ONLY produced by missing-required
      // noise -- some schemas express a controlled vocabulary (effectively
      // an enum) as `oneOf: [{ const: 'A' }, { const: 'B' }, ...]` instead of
      // a plain `enum`. An invalid value for one of those fields fails with
      // a oneOf/anyOf error too, and a blanket filter would silently let it
      // through. So only drop a oneOf/anyOf error when a 'required' error
      // exists at that same instancePath (i.e. it's the wrapper noise) --
      // keep it when it's the only error at that path, since that means it's
      // a genuine invalid-value failure.
      const requiredPaths = new Set(
        schemaErrors
          .filter(({ name }) => name === 'required')
          .map(({ instancePath }) => instancePath)
      )

      const structuralErrors = schemaErrors.filter(({ name, instancePath }) => {
        if (name === 'required') return false
        if ((name === 'oneOf' || name === 'anyOf') && requiredPaths.has(instancePath)) return false

        return true
      })

      if (structuralErrors.length > 0) {
        const messages = structuralErrors.map(({
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
        })

        setPendingErrors(messages)
        setPendingParsed(parsed)
        setShowConfirm(true)

        return
      }
    }

    commitSave(parsed)
  }

  const handleConfirmSaveAnyway = () => {
    commitSave(pendingParsed)
  }

  const handleConfirmBack = () => {
    setShowConfirm(false)
    setPendingErrors([])
    setPendingParsed(null)
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

      <Modal
        show={isEditing}
        onHide={handleCancel}
        size="lg"
        animation={false}
        aria-labelledby="json-preview-edit-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="json-preview-edit-modal-title">
            Edit JSON
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {
            parseError && (
              <div className="text-danger small mb-2" role="alert">
                {parseError}
              </div>
            )
          }

          <textarea
            className={`form-control font-monospace ${parseError ? 'is-invalid' : ''}`}
            rows={20}
            value={jsonText}
            onChange={handleTextChange}
            spellCheck={false}
            aria-label="Editable JSON metadata"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirm}
        onHide={handleConfirmBack}
        animation={false}
        aria-labelledby="json-preview-confirm-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="json-preview-confirm-modal-title">
            Confirm Save
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Your record has following errors:</p>

          <ul>
            {
              pendingErrors.map((message) => (
                <li key={message}>{message}</li>
              ))
            }
          </ul>

          <p>Would you like to proceed?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleConfirmBack}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmSaveAnyway}
          >
            Save & Continue
          </Button>
        </Modal.Footer>
      </Modal>
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
