import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import JSONPretty from 'react-json-pretty'
import { cloneDeep } from 'lodash-es'

import useAppContext from '../../hooks/useAppContext'
import removeEmpty from '../../utils/removeEmpty'
import Button from '../Button/Button'

const JsonPreview = () => {
  const {
    draft = {},
    setDraft
  } = useAppContext()

  // Remove || {} in MMT-4070
  const { ummMetadata = {} } = draft || {}

  const data = cloneDeep(removeEmpty(ummMetadata))

  const [isEditing, setIsEditing] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState(null)

  // Keep the buffer in sync with the draft whenever we're not actively editing
  // (e.g. the form itself changed a field).
  useEffect(() => {
    if (!isEditing) {
      setJsonText(JSON.stringify(data, null, 2))
    }
  }, [data, isEditing])

  const handleEditClick = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setError(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setError(null)
    setIsEditing(false)
  }

  const handleTextChange = (event) => {
    setJsonText(event.target.value)
    if (error) setError(null)
  }

  const handleSave = () => {
    let parsed

    try {
      parsed = JSON.parse(jsonText)
    } catch (parseError) {
      setError(`Invalid JSON: ${parseError.message}`)

      return
    }

    setDraft({
      ...draft,
      ummMetadata: parsed
    })

    setError(null)
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
            error && (
              <div className="text-danger small mb-2" role="alert">
                {error}
              </div>
            )
          }

          {
            isEditing
              ? (
                <textarea
                  className={`form-control font-monospace ${error ? 'is-invalid' : ''}`}
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

export default JsonPreview
