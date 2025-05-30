import React from 'react'
import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import VisualizationLatency from '../VisualizationLatency'

// Mock the CustomSelectWidget and CustomTextWidget components
vi.mock('../../CustomSelectWidget/CustomSelectWidget', () => ({
  default: ({
    onChange, value, options, label
  }) => (
    <select aria-label={label} onChange={(e) => onChange(e.target.value)} value={value}>
      {
        options.enumOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      }
    </select>
  )
}))

vi.mock('../../CustomTextWidget/CustomTextWidget', () => ({
  default: ({ onChange, value, label }) => (
    <input aria-label={label} type="text" onChange={(e) => onChange(e.target.value)} value={value || ''} />
  )
}))

const defaultProps = {
  onChange: vi.fn(),
  onBlur: vi.fn(),
  registry: {
    widgets: {},
    fields: {},
    definitions: {},
    formContext: {
      focusField: '',
      setFocusField: vi.fn()
    }
  },
  schema: {
    oneOf: [
      {
        title: 'Unit',
        pattern: '(\\d+(\\.\\d+)?) (second|minute|hour|day|week|month|year)(s)?'
      },
      {
        title: 'Not Applicable',
        enum: ['N/A']
      }
    ]
  },
  uiSchema: {}
}

describe('VisualizationLatency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when component is rendered', () => {
    test('should display the select widget for visualization latency type', () => {
      render(<VisualizationLatency {...defaultProps} />)
      expect(screen.getByLabelText('Visualization Latency Type')).toBeDefined()
    })
  })

  describe('when user selects "Unit" option', () => {
    test('should display value input and unit select', () => {
      render(<VisualizationLatency {...defaultProps} />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Unit' } })

      expect(screen.getByLabelText('Value')).toBeDefined()
      expect(screen.getByLabelText('Unit')).toBeDefined()
    })

    test('should call onChange with correct value when value and unit are entered', () => {
      render(<VisualizationLatency {...defaultProps} />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Unit' } })
      fireEvent.change(screen.getByLabelText('Value'), { target: { value: '5' } })
      fireEvent.change(screen.getByLabelText('Unit'), { target: { value: 'day' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('5 days')
    })
  })

  describe('when user selects "Not Applicable" option', () => {
    test('should call onChange with "N/A"', () => {
      render(<VisualizationLatency {...defaultProps} />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Not Applicable' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('N/A')
    })

    test('should not display value input and unit select', () => {
      render(<VisualizationLatency {...defaultProps} />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Not Applicable' } })

      expect(screen.queryByLabelText('Value')).toBeNull()
      expect(screen.queryByLabelText('Unit')).toBeNull()
    })
  })

  describe('when formData is provided', () => {
    test('should initialize with correct values for "Unit" option', () => {
      render(<VisualizationLatency {...defaultProps} formData="3 days" />)

      expect(screen.getByLabelText('Visualization Latency Type')).toHaveValue('Unit')
      expect(screen.getByLabelText('Value')).toHaveValue('3')
      expect(screen.getByLabelText('Unit')).toHaveValue('day')
    })

    test('should initialize with "Not Applicable" option when formData is "N/A"', () => {
      render(<VisualizationLatency {...defaultProps} formData="N/A" />)

      expect(screen.getByLabelText('Visualization Latency Type')).toHaveValue('Not Applicable')
    })
  })

  describe('when user changes the value', () => {
    test('should update the display and call onChange', () => {
      render(<VisualizationLatency {...defaultProps} formData="1 day" />)
      const valueInput = screen.getByLabelText('Value')
      fireEvent.change(valueInput, { target: { value: '2' } })

      expect(valueInput).toHaveValue('2')
      expect(defaultProps.onChange).toHaveBeenCalledWith('2 days')
    })
  })

  describe('when user changes the unit', () => {
    test('should update the display and call onChange', () => {
      render(<VisualizationLatency {...defaultProps} formData="1 day" />)
      const unitSelect = screen.getByLabelText('Unit')
      fireEvent.change(unitSelect, { target: { value: 'week' } })

      expect(unitSelect).toHaveValue('week')
      expect(defaultProps.onChange).toHaveBeenCalledWith('1 week')
    })

    test('should pluralize unit when value is greater than 1', () => {
      render(<VisualizationLatency {...defaultProps} formData="2 day" />)
      const unitSelect = screen.getByLabelText('Unit')
      fireEvent.change(unitSelect, { target: { value: 'week' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('2 weeks')
    })
  })

  describe('when value is 1', () => {
    test('should use singular unit', () => {
      render(<VisualizationLatency {...defaultProps} />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Unit' } })
      fireEvent.change(screen.getByLabelText('Value'), { target: { value: '1' } })
      fireEvent.change(screen.getByLabelText('Unit'), { target: { value: 'day' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('1 day')
    })
  })

  describe('when value changes from 1 to 2', () => {
    test('should update to plural unit', () => {
      render(<VisualizationLatency {...defaultProps} formData="1 day" />)
      const valueInput = screen.getByLabelText('Value')
      fireEvent.change(valueInput, { target: { value: '2' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('2 days')
    })
  })

  describe('when value changes from 2 to 1', () => {
    test('should update to singular unit', () => {
      render(<VisualizationLatency {...defaultProps} formData="2 days" />)
      const valueInput = screen.getByLabelText('Value')
      fireEvent.change(valueInput, { target: { value: '1' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('1 day')
    })
  })

  describe('when formData is invalid', () => {
    test('should not throw an error', () => {
      expect(() => {
        render(<VisualizationLatency {...defaultProps} formData="invalid data" />)
      }).not.toThrow()
    })
  })

  describe('when user switches between "Unit" and "Not Applicable"', () => {
    test('should clear the value and unit when switching to "Not Applicable"', () => {
      render(<VisualizationLatency {...defaultProps} formData="2 days" />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Not Applicable' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('N/A')
      expect(screen.queryByLabelText('Value')).toBeNull()
      expect(screen.queryByLabelText('Unit')).toBeNull()
    })

    test('should restore the previous value and unit when switching back to "Unit"', () => {
      render(<VisualizationLatency {...defaultProps} formData="2 days" />)
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Not Applicable' } })
      fireEvent.change(screen.getByLabelText('Visualization Latency Type'), { target: { value: 'Unit' } })

      expect(screen.getByLabelText('Value')).toHaveValue('2')
      expect(screen.getByLabelText('Unit')).toHaveValue('day')
    })
  })

  describe('when user enters an invalid value', () => {
    test('should update the onChange call with the invalid value', () => {
      render(<VisualizationLatency {...defaultProps} formData="1 day" />)
      const valueInput = screen.getByLabelText('Value')
      fireEvent.change(valueInput, { target: { value: 'abc' } })

      expect(defaultProps.onChange).toHaveBeenCalledWith('abc day')
    })

    test('should not pluralize the unit for non-numeric values', () => {
      render(<VisualizationLatency {...defaultProps} formData="1 day" />)
      const valueInput = screen.getByLabelText('Value')
      fireEvent.change(valueInput, { target: { value: 'abc' } })

      expect(defaultProps.onChange).not.toHaveBeenCalledWith('abc days')
    })
  })
})
