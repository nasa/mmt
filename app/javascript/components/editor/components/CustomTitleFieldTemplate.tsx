/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unused-prop-types */
import { FieldProps } from '@rjsf/utils'
import { observer } from 'mobx-react'
import React from 'react'
import MetadataEditor from '../MetadataEditor'

interface CustomTitleFieldTemplateProps extends FieldProps {
  title: string,
  required: boolean,
  schema: unknown,
  options: {
    editor: MetadataEditor
  }
}

class CustomTitleFieldTemplate extends React.Component<CustomTitleFieldTemplateProps, never> {
  render() {
    const {
      title, required
    } = this.props
    return (
      <div>
        <div style={{
          borderBottom: 'solid 2px rgb(240,240,240', paddingBottom: 6, marginTop: 8, marginBottom: 8
        }}
        >
          <span className="title">
            {title}
            {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
          </span>
        </div>
      </div>
    )
  }
}

export default observer(CustomTitleFieldTemplate)
