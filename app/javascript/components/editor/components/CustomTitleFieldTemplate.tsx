/* eslint-disable react/static-property-placement */
/* eslint-disable react/no-unused-prop-types */
import { observer } from 'mobx-react'
import React from 'react'
import MetadataEditor from '../MetadataEditor'
// import { RJSFSchema, TitleFieldProps } from '@rjsf/utils'
// import validator from '@rjsf/validator-ajv8'

type CustomTitleFieldTemplateProps = {
    title: string,
    required: boolean,
    schema: unknown,
    options: {
      editor: MetadataEditor
    }
  }

class CustomTitleFieldTemplate extends React.Component <CustomTitleFieldTemplateProps, never> {
  static defaultProps: {options:{editor:MetadataEditor}}
  // eslint-disable-next-line no-useless-constructor
  constructor(props: CustomTitleFieldTemplateProps) {
    super(props)
  }
  render() {
    const {
      title, required
    } = this.props
    return (
      <div>
        <h5 style={{
          borderBottom: 'solid 2px rgb(240,240,240', paddingBottom: 6, marginTop: 8, marginBottom: 8
        }}
        >
          {title}
          {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
        </h5>
      </div>
    )
  }
}

export default observer(CustomTitleFieldTemplate)
