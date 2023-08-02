/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldTemplateProps } from '@rjsf/utils'
import React from 'react'

interface CustomFieldTemplateProps extends FieldTemplateProps {
    classNames: string,
    help: any,
    errors: any,
    children: any
}

/**
 * JSON Schema seems to use this template class to render headings to array items
 */
export default class CustomFieldTemplate extends React.Component<CustomFieldTemplateProps, never> {
  render() {
    const {
      classNames, help, errors, children
    } = this.props
    return (
      <div data-testid="custom-field-template" className={`metadata-editor-field ${classNames}`}>
        {children}
        {errors}
        {help}
      </div>
    )
  }
}
