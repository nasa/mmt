/* eslint-disable @typescript-eslint/no-explicit-any */
import { DescriptionFieldProps } from '@rjsf/utils'
import React from 'react'

export default class CustomFieldTemplate extends React.Component<DescriptionFieldProps, never> {
  render() {
    const { description, id } = this.props
    return (
      <div data-testid="custom-description-field-template--description" id={id} className="description-box">
        {description}
      </div>
    )
  }
}
