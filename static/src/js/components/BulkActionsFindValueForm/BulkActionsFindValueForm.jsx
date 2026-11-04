import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/**
 * @typedef {Object} BulkActionsFindValueFormProps
 * @property {import('../../constants/bulkUpdateFields').BulkFindKeyField[]} flatFindKeys The flat UMM-C keys CMR matches `findValue` against for the selected field, and each one's type (so a 'number' key's input can be coerced before it's sent, instead of staying a string).
 * @property {Object} value The current findValue object being built, keyed by each field's key.
 * @property {Function} onChange A callback called with the next findValue object whenever a field changes.
 */

/**
 * Renders a BulkActionsFindValueForm component.
 *
 * CMR's bulk-update `findValue` only matches against a field's flat (non-nested)
 * properties, so this renders a plain key/value form instead of the full rjsf schema
 * form used for `updateValue`. Only keys the user fills in are matched against --
 * CMR requires every filled-in key to equal the field it's matching against, which is why
 * a 'number' key's value is coerced with Number(...) rather than left as the input's string.
 *
 * @component
 * @example <caption>Render a BulkActionsFindValueForm</caption>
 * return (
 *   <BulkActionsFindValueForm flatFindKeys={flatFindKeys} value={findValue} onChange={setFindValue} />
 * )
 */
const BulkActionsFindValueForm = ({ flatFindKeys, value, onChange }) => {
  const handleChange = (key, type, nextValue) => {
    const next = { ...value }

    if (nextValue === '') {
      delete next[key]
    } else {
      next[key] = type === 'number' ? Number(nextValue) : nextValue
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
                onChange={(event) => handleChange(key, type, event.target.value)}
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
