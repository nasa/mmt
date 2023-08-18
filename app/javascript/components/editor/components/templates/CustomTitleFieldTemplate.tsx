import { observer } from 'mobx-react'
import React from 'react'
import { FieldTemplateProps } from '@rjsf/utils'
import _ from 'lodash'

interface CustomTitleFieldTemplateProps extends FieldTemplateProps {
  title: string,
  required: boolean,
  // className: string
}

class CustomTitleFieldTemplate extends React.Component<CustomTitleFieldTemplateProps, never> {
  private scrollRef: React.RefObject<HTMLDivElement>

  constructor(props: CustomTitleFieldTemplateProps) {
    super(props)
    this.scrollRef = React.createRef()
  }

  executeScroll = () => this.scrollRef?.current?.scrollIntoView({ behavior: 'smooth' })

  render() {
    const {
      title, required, registry
    } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const { focusField } = editor
    const { uiSchema = {} } = this.props
    const { options = {} } = uiSchema
    const { title: uiTitle } = options
    const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
    const requiredUI = uiSchema['ui:required']
    const hideHeader = uiSchema['ui:hide-header']
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
        <div ref={this.scrollRef} data-testid="custom-title-field-template--heading" className="h2-box">
          {hideHeader ? null
            : (
              <span className={headerClassName}>
                {heading}
                {required || requiredUI ? <i data-testid="custom-title-field-template--required" className="eui-icon eui-required-o required-icon" /> : ''}
              </span>
            )}
        </div>
      </div>
    )
  }
}

export default observer(CustomTitleFieldTemplate)
