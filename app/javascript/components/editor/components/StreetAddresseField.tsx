import { cloneDeep, uniqueId } from 'lodash'
import React from 'react'
import { Col } from 'react-bootstrap'
import MetadataEditor from '../MetadataEditor'
import CustomTextWidget from './widgets/CustomTextWidget'

interface StreetAddressesState {
  lines: { [key: string]: string }
}
interface StreetAddressesProp {
  schema: {
    maxLength: number,
    description: string
  },
  options: {
    editor: MetadataEditor
  },
  formData: Array<string>,
  onChange: (value: Array<string>) => void
}

export default class StreetAddressesField extends React.Component<StreetAddressesProp, StreetAddressesState> {
  constructor(props: StreetAddressesProp) {
    super(props)
    const { formData } = props
    const lines = { line1: '', line2: '' as string, line3: '' as string }
    if (formData) {
      const line1 = formData.shift()
      if (line1) {
        lines.line1 = line1
      }
      const line2 = formData.shift()
      if (line2) {
        lines.line2 = line2
      }
      const line3 = formData.shift()
      if (line3) {
        lines.line3 = line3
      }
    }
    this.state = { lines }
  }
  updateValue(line: string, pos: number) {
    const { onChange } = this.props
    const { lines } = this.state
    lines[`line${pos}`] = line
    const { line1, line2, line3 } = lines
    const values: Array<string> = []
    if (line1 && line1.length > 0) {
      values.push(line1)
    }
    if (line2 && line2.length > 0) {
      values.push(line2)
    }
    if (line3 && line3.length > 0) {
      values.push(line3)
    }
    this.setState({ lines }, () => onChange(values))
  }

  render() {
    const { schema, options } = this.props
    const { lines } = this.state
    const clonedSchema = cloneDeep(schema)
    const headerDescription = schema.description
    clonedSchema.description = ''

    return (
      <>
        <span data-testid="street-address-field__title" style={{ fontStyle: 'italic' }}>{headerDescription}</span>
        <Col md={12} style={{ marginLeft: -15, marginBottom: 10, marginTop: 10 }}>
          <CustomTextWidget
            label="Address Line 1"
            schema={clonedSchema}
            value={lines.line1}
            required={false}
            id={uniqueId()}
            disabled={false}
            options={options}
            onChange={(value) => {
              this.updateValue(value, 1)
            }}
          />
        </Col>
        <Col md={12} style={{ marginLeft: -15, marginBottom: 10 }}>
          <CustomTextWidget
            label="Address Line 2"
            schema={clonedSchema}
            value={lines.line2}
            id={uniqueId()}
            required={false}
            disabled={false}
            options={options}
            onChange={(value) => {
              this.updateValue(value, 2)
            }}
          />
        </Col>
        <Col md={12} style={{ marginLeft: -15, marginBottom: 10 }}>
          <CustomTextWidget
            label="Address Line 3"
            schema={clonedSchema}
            value={lines.line3}
            id={uniqueId()}
            required={false}
            disabled={false}
            options={options}
            onChange={(value) => {
              this.updateValue(value, 3)
            }}
          />
        </Col>
      </>
    )
  }
}
