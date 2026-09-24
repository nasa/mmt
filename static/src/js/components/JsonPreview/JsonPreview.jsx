import React, {
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { cloneDeep } from 'lodash-es'
import PropTypes from 'prop-types'
import validator from '@rjsf/validator-ajv8'
import CodeMirror from '@uiw/react-codemirror'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import { jsonSchema } from 'codemirror-json-schema'
import CodeMirrorMerge from 'react-codemirror-merge'
import { FaCopy } from 'react-icons/fa'

import useAppContext from '../../hooks/useAppContext'
import removeEmpty from '../../utils/removeEmpty'
import Button from '../Button/Button'
import CustomModal from '../CustomModal/CustomModal'

import './JsonPreview.scss'

const { Original, Modified } = CodeMirrorMerge

const getValidationErrors = (text, schema) => {
  try {
    const parsed = JSON.parse(text)

    if (schema) {
      const { errors: schemaErrors = [] } = validator.validateFormData(parsed, schema)

      let structuralErrors = schemaErrors.filter(({ name }) => name !== 'required')

      structuralErrors = structuralErrors.filter((err) => {
        if (err.name === 'additionalProperties') {
          const parentPath = err.property === '.' ? '' : (err.property || '')
          const hasSpecificChildError = structuralErrors.some((e) => e.name !== 'additionalProperties'
            && e.name !== 'oneOf'
            && e.name !== 'anyOf'
            && (e.property || '').startsWith(parentPath === '' ? '.' : `${parentPath}.`))

          return !hasSpecificChildError
        }

        return true
      })

      if (structuralErrors.length > 0) {
        const messages = structuralErrors.map(({
          name, property, message, params
        }) => {
          if (name === 'additionalProperties' && params?.additionalProperty) {
            const location = property ? `${property} ` : ''

            return `${location} must NOT have additional property '${params.additionalProperty}'`
          }

          return property ? `${property} ${message}` : message
        })

        return [...new Set(messages)]
      }
    }

    return [] // No schema errors, or no schema provided
  } catch (e) {
    // JSON parse failed (e.g. missing comma)
    return [`Invalid JSON: ${e.message}`]
  }
}

const JsonPreview = ({ schema }) => {
  const {
    draft = {},
    setDraft
  } = useAppContext()

  const { ummMetadata = {} } = draft || {}

  const data = cloneDeep(removeEmpty(ummMetadata))

  const [isEditing, setIsEditing] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [originalJson, setOriginalJson] = useState('')
  const [showDiff, setShowDiff] = useState(false)
  const [activeErrors, setActiveErrors] = useState([])

  const handleTextChange = useCallback((value) => {
    setJsonText(value)
  }, [])

  // Debounced background validation
  useEffect(() => {
    let validateTimer

    if (isEditing) {
      validateTimer = setTimeout(() => {
        setActiveErrors(getValidationErrors(jsonText, schema))
      }, 300) // 300ms debounce
    }

    return () => {
      if (validateTimer) clearTimeout(validateTimer)
    }
  }, [jsonText, schema, isEditing])

  // Memoize the extensions for the main editor so they don't re-initialize on every keystroke
  const editorExtensions = useMemo(() => [
    json(),
    lintGutter(),
    linter(jsonParseLinter()),
    ...(schema ? [jsonSchema(schema)] : [])
  ], [schema])

  // Memoize the read-only extensions used in the Diff/View modes
  const readOnlyExtensions = useMemo(() => [json()], [])

  const handleEditClick = () => {
    const stringified = JSON.stringify(data, null, 2)
    setJsonText(stringified)
    setOriginalJson(stringified)
    setActiveErrors([])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setJsonText(JSON.stringify(data, null, 2))
    setActiveErrors([])
    setIsEditing(false)
  }

  const handleContinueClick = () => {
    // Synchronously validate to catch any race conditions before the debounce finishes
    const currentErrors = getValidationErrors(jsonText, schema)

    if (currentErrors.length > 0) {
      setActiveErrors(currentErrors)

      return
    }

    setIsEditing(false)
    setShowDiff(true)
  }

  const handleConfirm = () => {
    setDraft({
      ...draft,
      ummMetadata: JSON.parse(jsonText)
    })

    setShowDiff(false)
    setIsEditing(false) // Closes both modals
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(jsonText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
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

            <CodeMirror
              className="json-editor-font"
              value={JSON.stringify(data, null, 2)}
              theme="light"
              editable={false}
              extensions={readOnlyExtensions}
            />

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
                activeErrors.length > 0 && (
                  <div className="alert alert-danger p-2 mb-3 ms-4" role="alert">
                    <div className="fw-bold mb-1">Please fix the following errors to continue:</div>
                    <ul className="mb-0 ps-3">
                      {
                        activeErrors.map((err) => (
                          <li key={err} className="small">{err}</li>
                        ))
                      }
                    </ul>
                  </div>
                )
              }

              <div className="ms-4">
                <div className="d-flex justify-content-end mb-2">
                  <Button
                    icon={FaCopy}
                    iconTitle="A copy icon"
                    onClick={handleCopyClick}
                    title="Copy JSON"
                    variant="light-dark"
                    size="sm"
                  >
                    {isCopied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                </div>
                <div className="border rounded overflow-hidden">
                  <CodeMirror
                    className="json-editor-font"
                    value={jsonText}
                    height="25rem"
                    onChange={handleTextChange}
                    theme="light"
                    extensions={editorExtensions}
                  />
                </div>
              </div>
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
              label: 'Continue',
              variant: 'primary',
              onClick: handleContinueClick,
              disabled: activeErrors.length > 0
            }
          ]
        }
      />

      <CustomModal
        show={showDiff}
        toggleModal={
          (nextShow) => {
            if (!nextShow) setShowDiff(false)
          }
        }
        size="xl"
        header="Review Changes"
        message={
          (
            <>
              <p className="mb-3 text-muted">
                Review your changes before saving.
                The original metadata is on the left, and your edits are on the right.
              </p>
              <div className="border rounded overflow-hidden">
                <CodeMirrorMerge
                  className="diff-editor-container json-editor-font"
                  orientation="a-b"
                  autoFocus
                  collapseUnchanged={
                    {
                      margin: 3, // Number of unchanged lines to show around the changes
                      minSize: 10 // Minimum number of unchanged lines required before it decides to hide them
                    }
                  }
                >
                  <Original
                    value={originalJson}
                    extensions={readOnlyExtensions}
                    editable={false}
                  />
                  <Modified
                    value={jsonText}
                    extensions={readOnlyExtensions}
                    editable={false}
                  />
                </CodeMirrorMerge>
              </div>
            </>
          )
        }
        actions={
          [
            {
              label: 'Back to Edit',
              variant: 'secondary',
              onClick: () => {
                setShowDiff(false)
                setIsEditing(true)
              }
            },
            {
              label: 'Apply',
              variant: 'primary',
              onClick: handleConfirm
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
