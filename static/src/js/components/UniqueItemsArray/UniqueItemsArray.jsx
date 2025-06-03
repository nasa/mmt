import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import { startCase } from 'lodash-es'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './UniqueItemsArray.scss'

const UniqueItemsArray = ({
  id,
  disabled,
  label,
  onChange,
  options,
  required,
  schema,
  uiSchema,
  value
}) => {
  const handleChange = (event) => {
    const { checked, value: optionValue } = event.target
    let newValue = [...value]

    if (checked) {
      newValue.push(optionValue)
    } else {
      newValue = newValue.filter((v) => v !== optionValue)
    }

    onChange(newValue)
  }

  const fieldTitle = uiSchema['ui:title'] || startCase(label)

  return (
    <CustomWidgetWrapper
      description={schema.description}
      label={label}
      id={id}
      required={required}
      title={fieldTitle}
    >
      <div className="unique-items-array">
        <div className="unique-items-array__element">
          <Form.Group controlId={id}>
            <div className="unique-items-array__options">
              {
                options.enumOptions.map((option) => (
                  <Form.Check
                    key={option.value}
                    type="checkbox"
                    id={`${id}_${option.value}`}
                    label={option.label}
                    value={option.value}
                    checked={value.includes(option.value)}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                ))
              }
            </div>
          </Form.Group>
        </div>
      </div>
    </CustomWidgetWrapper>
  )
}

UniqueItemsArray.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.shape({
    enumOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    }))
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }),
  value: PropTypes.arrayOf(PropTypes.string)
}

UniqueItemsArray.defaultProps = {
  disabled: false,
  required: false,
  uiSchema: {},
  value: []
}

export default UniqueItemsArray
