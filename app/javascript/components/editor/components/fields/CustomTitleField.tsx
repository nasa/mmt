import { observer } from 'mobx-react'
import React from 'react'
import { FieldProps } from '@rjsf/utils'
import _ from 'lodash'

interface CustomTitleFieldProps extends FieldProps {
  title: string,
  required: boolean,
  className: string
  groupBoxClassName: string
}

/**
 * JSON Schema seems to use this class to render headings, except headings to array items (see CustomArrayTemplate class for that).
 */
class CustomTitleField extends React.Component<CustomTitleFieldProps, never> {
  private scrollRef: React.RefObject<HTMLDivElement>

  constructor(props: CustomTitleFieldProps) {
    super(props)
    this.scrollRef = React.createRef()
  }

  executeScroll = () => this.scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })

  render() {
    const {
      title, required, requiredUI, registry, className = 'h1-title', groupBoxClassName = 'h1-box', uiSchema = {}
    } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const { focusField } = editor

    let heading = title
    if (uiSchema['ui:title']) {
      heading = uiSchema['ui:title']
    } else {
      const [firstPart] = title.split(/-/)
      heading = _.startCase(firstPart)
    }

    if (title.replace(/ /g, '') === focusField) {
      setTimeout(() => {
        this.executeScroll()
      })
    }

    return (
      <div>
        <div ref={this.scrollRef} className={groupBoxClassName}>
          <span data-testid="custom-title-field--heading" className={`${className}`}>
            {heading}
            {required || requiredUI ? <i data-testid="custom-title-field--required" className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
      </div>
    )
  }
}

export default observer(CustomTitleField)
