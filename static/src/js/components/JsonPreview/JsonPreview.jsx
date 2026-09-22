import React, {
  useState,
  useCallback,
  useMemo
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
  const [isCopied, setIsCopied] = useState(false)
  const [originalJson, setOriginalJson] = useState('')
  const [showDiff, setShowDiff] = useState(false)

  const handleTextChange = useCallback((value) => {
    setJsonText(value)
    if (parseError) setParseError(null)
  }, [parseError]) // SetJsonText and setParseError are stable, but parseError is checked here

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

      // Only surface structural errors.
      // 'required' errors are ignored so the JSON editor stays as permissive as the form.
      let structuralErrors = schemaErrors.filter(({ name }) => name !== 'required')

      // Hide "additionalProperties" ghost errors for an object if
      // that object has a more specific structural error inside it.
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

      // Format remaining errors
      // AJV reports the bad key in params.additionalProperty, not in `message`
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

        const uniqueMessages = [...new Set(messages)]

        setPendingErrors(uniqueMessages)
        setShowErrors(true)

        return
      }
    }

    // If no errors, open the Diff Modal so the user can review their changes.
    setIsEditing(false)
    setShowDiff(true)
  }

  const handleErrorsBack = () => {
    setShowErrors(false)
    setPendingErrors([])
  }

  const handleConfirmSave = () => {
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
                parseError && (
                  <div className="text-danger small mb-2" role="alert">
                    {parseError}
                  </div>
                )
              }

              <div style={{ marginLeft: '40px' }}>
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
                <div style={
                  {
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }
                }
                >
                  <CodeMirror
                    className="json-editor-font"
                    value={jsonText}
                    height="400px"
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
              <div style={
                {
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }
              }
              >
                <CodeMirrorMerge
                  cclassName="diff-editor-container json-editor-font"
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
                    extensions={editorExtensions}
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
              label: 'Confirm & Save',
              variant: 'primary',
              onClick: handleConfirmSave
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
