import { observer } from 'mobx-react'
import React from 'react'
import { FieldProps } from '@rjsf/utils'
import _ from 'lodash'

interface CustomTitleFieldProps extends FieldProps {
  title: string,
  required: boolean,
  className: string
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
      title, required, registry, className = 'h1-title'
    } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const { focusField } = editor
    const { uiSchema = {} } = this.props
    const { options = {} } = uiSchema
    const { title: uiTitle } = options

    let heading = title
    if (uiTitle) {
      heading = uiTitle
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
        <div ref={this.scrollRef} className="h1-box">
          <span data-testid="custom-title-field--heading" className={`${className}`}>
            {heading}
            {required ? <i data-testid="custom-title-field--required" className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
      </div>
    )
  }
}

export default observer(CustomTitleField)
