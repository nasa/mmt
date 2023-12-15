import React, { useState } from 'react'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types'
import { cloneDeep, uniqueId } from 'lodash'

import For from '../For/For'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'

import './StreetAddressField.scss'

/**
 * StreetAddressField
 * @typedef {Object} StreetAddressField
 * @property {Object} formData An Object with the saved metadata
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders StreetAddressField
 * @param {StreetAddressField} props
 */
const StreetAddressField = ({
  formData,
  onChange,
  registry,
  schema,
  uiSchema
}) => {
  const [lines, setLines] = useState(formData)

  const { description } = schema

  const handleUpdateAddressLine = (line, pos) => {
    lines[pos] = line
    setLines(lines)
    onChange(lines)
  }

  const clonedSchema = cloneDeep(schema)
  clonedSchema.description = ''
  // Prefix with 'f' for 'field' because to be queriable, id should not start with a number.
  const id = uniqueId('f')

  return (
    <div>
      <span className="street-address-field__description-box">
        {description}

        <For each={[...new Array(3)]}>
          {
            (_value, index) => (
              <Col
                key={`address_line_${index}`}
                md={12}
                className="street-address-field__address-line"
              >
                <CustomTextWidget
                  disabled={false}
                  id={`${id}_${index}`}
                  label={`Address Line ${index + 1}`}
                  name={`address_line_${index}`}
                  onChange={(value) => { handleUpdateAddressLine(value, index) }}
                  placeholder=""
                  registry={registry}
                  required={false}
                  schema={clonedSchema}
                  uiSchema={uiSchema}
                  value={lines[index]}
                />
              </Col>
            )
          }
        </For>
      </span>
    </div>
  )
}

StreetAddressField.defaultProps = {
  formData: []
}

StreetAddressField.propTypes = {
  formData: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default StreetAddressField
