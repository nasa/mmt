/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ReactNode } from 'react'
import _ from 'lodash'
import { FieldInfo } from './FieldInfo'
import { ProgressCircleType } from './ProgressCircleType'
import './ProgressField.css'
import withRouter from '../withRouter'
import MetadataEditor from '../../MetadataEditor'

type ProgressFieldProps = {
  fieldInfo: FieldInfo
  router: RouterType
  editor: MetadataEditor
}

class ProgressField extends React.Component<ProgressFieldProps, never> {
  progressFieldCircle(type: ProgressCircleType, required: boolean) {
    const { fieldInfo } = this.props
    const { name, error } = fieldInfo

    let message = name
    if (error) {
      message = `${name} - ${error.stack}`
    }
    let messageRequired = `${name} is required`
    if (error) {
      messageRequired = `${name} - ${error.stack}`
    }
    let icon: ReactNode
    switch (type) {
      case ProgressCircleType.Invalid:
        icon = <i title={message} className="eui-icon eui-fa-minus-circle invalid-circle" />
        break
      case ProgressCircleType.NotStarted:
        if (required) {
          icon = <i title={messageRequired} className="eui-icon eui-required-o not-started-required-circle" />
        } else {
          icon = <i title={message} className="eui-icon eui-fa-circle-o not-started-not-required-circle" />
        }
        break
      case ProgressCircleType.Pass:
        if (required) {
          icon = <i title={messageRequired} className="eui-icon eui-required icon-green pass-required-circle" />
        } else {
          icon = <i title={message} className="eui-icon eui-fa-circle icon-grey pass-not-required-circle" />
        }
        break
      case ProgressCircleType.Error:
        icon = <i title={message} className="eui-icon eui-fa-minus-circle error-circle" />
        break
      default:
        icon = <span>Status Unknown</span>
    }
    return (
      // Todo: Fix this
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <span
        className="progressField"
        onClick={() => this.navigateTo()}
        data-testid={`progress-field__${_.kebabCase(name)}_link`}
      >
        {icon}
      </span>
    )
  }
  navigateTo() {
    const { fieldInfo, router, editor } = this.props
    const {
      index, section
    } = fieldInfo
    const { params } = router
    const { id } = params
    const sectionName = section.replace(/\s/g, '_')
    if (index) {
      // editor.setArrayField(index)
    }
    setTimeout(() => {
      window.location.href = `/${editor.documentType}/${id}/edit/${sectionName}`
    }, 50)
    // navigate(`/${editor.documentType}/${id}/edit/${sectionName}`, { replace: false })
  }
  render() {
    const { fieldInfo } = this.props
    const {
      name, index = '', required, status
    } = fieldInfo
    const requiredAsString = required ? 'required' : 'not-required'
    return <span className="field-circle" key={JSON.stringify(fieldInfo)} data-testid={`progress-field__${_.kebabCase(name)}_${index}_${requiredAsString}_${_.kebabCase(status)}`}>{this.progressFieldCircle(fieldInfo.status, fieldInfo.required)}</span>
  }
}
export default (withRouter(ProgressField))
