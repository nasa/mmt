import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/**
 * @typedef {Object} BulkActionsFindValueFormProps
 * @property {import('../../constants/bulkUpdateFields').BulkFindKeyField[]} flatFindKeys The flat UMM-C keys CMR matches `findValue` against for the selected field, and each one's type (used to pick the input's native type, e.g. `number`).
 * @property {Object} value The current findValue object being built, keyed by each field's key -- always the raw input string, uncoerced and unvalidated (the caller is responsible for both, since this component only tracks what's on screen).
 * @property {Function} onChange A callback called with the next findValue object whenever a field changes.
 */

/**
 * Renders a BulkActionsFindValueForm component.
 *
 * CMR's bulk-update `findValue` only matches against a field's flat (non-nested)
 * properties, so this renders a plain key/value form instead of the full rjsf schema
 * form used for `updateValue`. Only keys the user fills in are matched against -- CMR
 * requires every filled-in key to equal the field it's matching against.
 *
 * Deliberately does not coerce or validate a 'number' key's value here: doing so previously
 * meant an invalid value (e.g. a fraction) was silently deleted, clearing the input the user
 * was still looking at and letting Submit stay enabled as long as some other field was
 * filled -- so an invalid find condition could be dropped from the request without the user
 * noticing. The raw string is kept as-is; the caller validates and coerces it before submit.
 *
 * @component
 * @example <caption>Render a BulkActionsFindValueForm</caption>
 * return (
 *   <BulkActionsFindValueForm flatFindKeys={flatFindKeys} value={findValue} onChange={setFindValue} />
 * )
 */
const BulkActionsFindValueForm = ({ flatFindKeys, value, onChange }) => {
  const handleChange = (key, nextValue) => {
    const next = { ...value }

    if (nextValue === '') {
      delete next[key]
    } else {
      next[key] = nextValue
    }

    onChange(next)
  }

  return (
    <Row>
      {
        flatFindKeys.map(({ key, type }) => (
          <Col md={6} key={key} className="mb-3">
            <Form.Group controlId={`bulk-actions-find-value_${key}`}>
              <Form.Label>{key}</Form.Label>
              <Form.Control
                type={type === 'number' ? 'number' : 'text'}
                value={value[key] ?? ''}
                onChange={(event) => handleChange(key, event.target.value)}
              />
            </Form.Group>
          </Col>
        ))
      }
    </Row>
  )
}

const findKeyFieldShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'number']).isRequired
})

BulkActionsFindValueForm.propTypes = {
  flatFindKeys: PropTypes.arrayOf(findKeyFieldShape).isRequired,
  value: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}

export default BulkActionsFindValueForm
