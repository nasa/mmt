import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, uniqueId } from 'lodash'

import './StreetAddressField.scss'
import { Col } from 'react-bootstrap'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'

const StreetAddressField = ({
  onChange,
  registry,
  schema,
  uiSchema = {},
  formData,
  noLines
}) => {
  for (let i = 0; i < noLines - formData.count; i += 1) {
    formData.push('')
  }

  const [lines, setLines] = useState(formData)

  const { description } = schema

  const handleUpdateAddressLine = (line, pos) => {
    lines[pos] = line
    const values = Object.values(lines)
    setLines(values)
    onChange(values)
  }

  const clonedSchema = cloneDeep(schema)
  clonedSchema.description = ''
  const id = uniqueId()
  const lineWidgets = []
  for (let i = 0; i < 3; i += 1) {
    lineWidgets.push(
      <Col
        key={`address_line_${i}`}
        md={12}
        className="street-address-field__address-line"
      >
        <CustomTextWidget
          name={`address_line_${i}`}
          label={`Address Line ${i + 1}`}
          schema={clonedSchema}
          value={lines[i]}
          required={false}
          id={`${id}_${i}`}
          disabled={false}
          onChange={(value) => { handleUpdateAddressLine(value, i) }}
          onBlur={() => undefined}
          onFocus={() => undefined}
          registry={registry}
          uiSchema={uiSchema}
          placeholder=""
        />
      </Col>
    )
  }

  return (

    <div>
      <span className="street-address-field__description-box">
        {description}
        {lineWidgets}
      </span>
    </div>
  )
}

StreetAddressField.defaultProps = {
  formData: [],
  noLines: 3
}

StreetAddressField.propTypes = {
  formData: PropTypes.arrayOf(PropTypes.string),
  noLines: PropTypes.number,
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
