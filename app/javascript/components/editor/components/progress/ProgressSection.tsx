/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import { observer } from 'mobx-react'
import React, { ReactNode } from 'react'
import _ from 'lodash'
import { FieldInfo } from './FieldInfo'
import { ProgressCircleType } from './ProgressCircleType'
import ProgressField from './ProgressField'
import './ProgressSection.css'
import withRouter from '../withRouter'
import MetadataEditor from '../../MetadataEditor'

type ProgressSectionProps = {
  section: string
  status: ProgressCircleType
  fields: Array<FieldInfo>
  router: RouterType
  editor: MetadataEditor
}

class ProgressSection extends React.Component<ProgressSectionProps, never> {
  progressSectionCircle(type: ProgressCircleType) {
    switch (type) {
      case ProgressCircleType.Pass:
        return (
          <i className="eui-icon eui-check pass-circle" />
        )
      case ProgressCircleType.NotStarted:
      case ProgressCircleType.Error:
      case ProgressCircleType.Invalid:
        return (
          <i className="eui-icon eui-fa-circle-o invalid-circle" />
        )
      default: return (
        <span>Status Unknown</span>
      )
    }
  }
  navigateTo() {
    const {
      section, router, editor
    } = this.props
    const { params } = router
    const { id } = params
    const sectionName = section.replace(/\s/g, '_')
    setTimeout(() => {
      window.location.href = `/${editor.documentType}/${id}/edit/${sectionName}`
    }, 50)
    // navigate(`/${editor.documentType}/${id}/edit/${sectionName}`, { replace: false })
  }
  render() {
    const {
      section, status, fields, editor
    } = this.props
    const rows = fields.map((field: FieldInfo): ReactNode => (
      <span key={JSON.stringify(field)} data-testid={`progress-field__${_.kebabCase(field.name)}_${field.index}`}>
        <ProgressField fieldInfo={field} editor={editor} />
      </span>
    ))
    return (
      <div className="progress-view" key={JSON.stringify(fields)} data-testid={`progress-section__${_.kebabCase(section)}_${_.kebabCase(status)}`}>
        <div className="section-circle">
          {this.progressSectionCircle(status)}
        </div>
        <div>
          <div className="section-label">
            <div
              onClick={() => this.navigateTo()}
              data-testid={`progress-section__${_.kebabCase(section)}_link`}
            >
              {section}
            </div>
          </div>
          <div>
            {rows}
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(observer(ProgressSection))
