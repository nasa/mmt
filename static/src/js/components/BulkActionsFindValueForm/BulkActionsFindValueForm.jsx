import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import '../CustomWidgetWrapper/CustomWidgetWrapper.scss'

/**
 * @typedef {Object} BulkActionsFindValueFormProps
 * @property {import('../../constants/bulkUpdateFields').BulkFindKeyField[]} flatFindKeys The flat UMM-C keys CMR matches `findValue` against for the selected field.
 * @property {Object} value The current findValue object being built, keyed by each field's key.
 * @property {Function} onChange A callback called with the next findValue object whenever a field changes.
 */

/**
 * Renders a BulkActionsFindValueForm component.
 *
 * CMR's bulk-update `findValue` only matches against a field's flat (non-nested)
 * properties, so this renders a plain key/value form. Only keys the user fills in are
 * matched against -- CMR requires every filled-in key to equal the field it's matching
 * against.
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

  // Each field gets its own Row so fields always stack in the order given, while Col
  // (md={6}) keeps each input from stretching the full page width.
  const renderField = ({ key }) => (
    <Row key={key}>
      <Col md={6} className="mb-3">
        <Form.Group controlId={`bulk-actions-find-value_${key}`}>
          <Form.Label className="custom-widget-wrapper__label text-gray-700">{key}</Form.Label>
          <Form.Control
            type="text"
            value={value[key] ?? ''}
            onChange={(event) => handleChange(key, event.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  )

  return (
    <>
      {flatFindKeys.map(renderField)}
    </>
  )
}

const findKeyFieldShape = PropTypes.shape({
  key: PropTypes.string.isRequired
})

BulkActionsFindValueForm.propTypes = {
  flatFindKeys: PropTypes.arrayOf(findKeyFieldShape).isRequired,
  value: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}

export default BulkActionsFindValueForm
