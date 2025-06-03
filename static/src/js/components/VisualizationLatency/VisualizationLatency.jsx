import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'

const VisualizationLatency = ({
  formData,
  onChange,
  onBlur,
  registry,
  schema,
  uiSchema
}) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [value, setValue] = useState(null)
  const [unit, setUnit] = useState(null)

  useEffect(() => {
    if (formData === 'N/A') {
      setSelectedOption('Not Applicable')
    } else if (formData) {
      setSelectedOption('Unit')
      const match = formData.match(/(\d+(?:\.\d+)?)\s+(second|minute|hour|day|week|month|year)s?/)
      if (match) {
        setValue(match[1])
        setUnit(match[2])
      }
    }
  }, [formData])

  const getPluralUnit = (val, unitSingular) => (val > 1 ? `${unitSingular}s` : unitSingular)

  const handleOptionChange = (option) => {
    setSelectedOption(option)
    if (option === 'Not Applicable') {
      onChange('N/A')
    } else {
      onChange(`${value} ${getPluralUnit(value, unit)}`)
    }
  }

  const handleValueChange = (newValue) => {
    setValue(newValue)
    onChange(`${newValue} ${getPluralUnit(newValue, unit)}`)
  }

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit)
    onChange(`${value} ${getPluralUnit(value, newUnit)}`)
  }

  const unitOptions = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

  return (
    <div>
      <CustomSelectWidget
        id="visualization-latency-type"
        label="Visualization Latency Type"
        onBlur={onBlur}
        onChange={handleOptionChange}
        options={
          {
            enumOptions: schema.oneOf.map((option) => ({
              label: option.title,
              value: option.title
            }))
          }
        }
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        value={selectedOption}
      />
      {
        selectedOption === 'Unit' && (
          <div>
            <CustomTextWidget
              id="visualization-latency-value"
              label="Value"
              onBlur={onBlur}
              onChange={handleValueChange}
              registry={registry}
              schema={{ type: 'number' }}
              uiSchema={{}}
              value={value}
            />
            <CustomSelectWidget
              id="visualization-latency-unit"
              label="Unit"
              onChange={handleUnitChange}
              onBlur={onBlur}
              options={
                {
                  enumOptions: unitOptions.map((unitOption) => ({
                    label: getPluralUnit(value, unitOption),
                    value: unitOption
                  }))
                }
              }
              registry={registry}
              schema={
                {
                  type: 'string',
                  enum: unitOptions
                }
              }
              uiSchema={{}}
              value={unit}
            />
          </div>
        )
      }
    </div>
  )
}

VisualizationLatency.defaultProps = {
  formData: undefined
}

VisualizationLatency.propTypes = {
  formData: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  registry: PropTypes.shape({}).isRequired,
  schema: PropTypes.shape({
    oneOf: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      pattern: PropTypes.string,
      enum: PropTypes.arrayOf(PropTypes.string)
    }))
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default VisualizationLatency
