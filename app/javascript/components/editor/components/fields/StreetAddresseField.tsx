/* eslint-disable react/require-default-props */
import { cloneDeep } from 'lodash'
import React from 'react'
import { Col } from 'react-bootstrap'
import {
  FieldProps
} from '@rjsf/utils'
import CustomTextWidget from '../widgets/CustomTextWidget'
import './StreetAddressField.css'

interface StreetAddressesState {
  lines: { [key: string]: string }
}
interface StreetAddressesProp extends FieldProps {
  schema: {
    maxLength: number,
    description: string
  },
  formData: Array<string>,
  onChange: (value: Array<string>) => void,
  uiSchema: object
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
    this.updateValue = this.updateValue.bind(this)
    this.onHandleChangeLine1 = this.onHandleChangeLine1.bind(this)
    this.onHandleChangeLine2 = this.onHandleChangeLine2.bind(this)
    this.onHandleChangeLine3 = this.onHandleChangeLine3.bind(this)
  }

  onHandleChangeLine1(value) {
    this.updateValue(value, 1)
  }
  onHandleChangeLine2(value) {
    this.updateValue(value, 2)
  }
  onHandleChangeLine3(value) {
    this.updateValue(value, 3)
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
    const {
      schema, options, id, registry, uiSchema
    } = this.props
    const { lines } = this.state
    const clonedSchema = cloneDeep(schema)
    const headerDescription = schema.description
    clonedSchema.description = ''

    return (
      <>
        <span data-testid="street-address-field__title" className="header-description">{headerDescription}</span>
        <Col md={12} className="address-line">
          <CustomTextWidget
            name="address_line_1"
            label="Address Line 1"
            schema={clonedSchema}
            value={lines.line1}
            required={false}
            id={`${id}_1`}
            disabled={false}
            options={options}
            onChange={this.onHandleChangeLine1}
            onBlur={() => undefined}
            onFocus={() => undefined}
            registry={registry}
            uiSchema={uiSchema}
          />
        </Col>
        <Col md={12} className="address-line">
          <CustomTextWidget
            name="address_line_2"
            label="Address Line 2"
            schema={clonedSchema}
            value={lines.line2}
            id={`${id}_2`}
            required={false}
            disabled={false}
            options={options}
            onChange={this.onHandleChangeLine2}
            onBlur={() => undefined}
            onFocus={() => undefined}
            registry={registry}
            uiSchema={uiSchema}
          />
        </Col>
        <Col md={12} className="address-line">
          <CustomTextWidget
            name="address_line_3"
            label="Address Line 3"
            schema={clonedSchema}
            value={lines.line3}
            id={`${id}_3`}
            required={false}
            disabled={false}
            options={options}
            onChange={this.onHandleChangeLine3}
            onBlur={() => undefined}
            onFocus={() => undefined}
            registry={registry}
            uiSchema={uiSchema}
          />
        </Col>
      </>
    )
  }
}
