/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unused-prop-types */
import { FieldProps } from '@rjsf/utils'
import { observer } from 'mobx-react'
import React from 'react'
import './CustomTitleFieldTemplate.css'

interface CustomTitleFieldTemplateProps extends FieldProps {
  title: string,
  required: boolean,
  schema: unknown,
}

class CustomTitleFieldTemplate extends React.Component<CustomTitleFieldTemplateProps, never> {
  private scrollRef: React.RefObject<HTMLDivElement>

  constructor(props: CustomTitleFieldTemplateProps) {
    super(props)
    this.scrollRef = React.createRef()
  }

  executeScroll = () => this.scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  render() {
    const {
      title, required, registry, className = 'custom-title'
    } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const { focusField } = editor
    if (title.replace(' ', '') === focusField) {
      setTimeout(() => {
        this.executeScroll()
      })
    }

    return (
      <div>
        <div ref={this.scrollRef} className="custom-title-header">
          <span className={className}>
            {title}
            {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
      </div>
    )
  }
}

export default observer(CustomTitleFieldTemplate)
