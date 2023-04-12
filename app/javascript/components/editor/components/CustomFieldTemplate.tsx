/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldTemplateProps } from '@rjsf/utils'
import React from 'react'

interface CustomFieldTemplateProps extends FieldTemplateProps {
    classNames: string,
    help: any,
    errors: any,
    children: any
}

export default class CustomFieldTemplate extends React.Component<CustomFieldTemplateProps, never> {
  render() {
    const {
      classNames, help, errors, children
    } = this.props
    return (
      <div className={classNames}>
        {children}
        {errors}
        {help}
      </div>
    )
  }
}
