import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import CodeMirror from '@uiw/react-codemirror'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import { jsonSchema } from 'codemirror-json-schema'

import buildUpdateValueJsonSchema from '@/js/utils/buildUpdateValueJsonSchema'

/**
 * @typedef {Object} BulkActionsUpdateValueEditorProps
 * @property {import('../../constants/bulkUpdateFields').BulkUpdateValueField[]} fields The field defs for the selected updateField, used to build schema-driven autocomplete/hover help.
 * @property {Boolean} allowMultiple Whether updateValue may be an array of entries, per CMR's support for that on this update type.
 * @property {String} value The current updateValue JSON text.
 * @property {Function} onChange A callback called with the next JSON text on every edit.
 */

/**
 * Renders a BulkActionsUpdateValueEditor component.
 *
 * A single JSON editor for `updateValue`, prepopulated with every key the selected
 * updateField accepts (see buildUpdateValueJsonSkeleton), instead of a bespoke per-field
 * form. Offers schema-driven autocomplete, hover help, and inline syntax linting.
 *
 * @component
 * @example <caption>Render a BulkActionsUpdateValueEditor</caption>
 * return (
 *   <BulkActionsUpdateValueEditor
 *     fields={fieldConfig.updateValueFields}
 *     allowMultiple={typeConfig.supportsMultipleUpdateValues}
 *     value={updateValueJson}
 *     onChange={setUpdateValueJson}
 *   />
 * )
 */
const BulkActionsUpdateValueEditor = ({
  fields,
  allowMultiple,
  value,
  onChange
}) => {
  const schema = useMemo(
    () => buildUpdateValueJsonSchema(fields, allowMultiple),
    [fields, allowMultiple]
  )

  const extensions = useMemo(() => [
    json(),
    lintGutter(),
    linter(jsonParseLinter()),
    jsonSchema(schema)
  ], [schema])

  return (
    <div className="border rounded overflow-hidden">
      <CodeMirror
        className="json-editor-font"
        value={value}
        height="16rem"
        theme="light"
        onChange={onChange}
        extensions={extensions}
      />
    </div>
  )
}

const fieldShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number', 'select', 'multiselect', 'nested-array']).isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  // The sub-fields of one entry, required when type is 'nested-array' -- not deeply typed
  // since PropTypes.shape can't reference itself recursively.
  fields: PropTypes.arrayOf(PropTypes.shape({}))
})

BulkActionsUpdateValueEditor.propTypes = {
  fields: PropTypes.arrayOf(fieldShape).isRequired,
  allowMultiple: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default BulkActionsUpdateValueEditor
