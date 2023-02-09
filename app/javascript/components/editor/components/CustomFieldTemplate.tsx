import React from 'react'

type CustomFieldTemplateProps = {
    classNames: string,
    help: string,
    errors: object,
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
