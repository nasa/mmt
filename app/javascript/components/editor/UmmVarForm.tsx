/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import { observer } from 'mobx-react'
import App from './App'
import MetadataEditor from './MetadataEditor'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import UmmVarModel from './model/UmmVarModel'

interface UmmVarFormProps {
  heading: string,
  token: string,
  user: string,
  provider: string
  shouldRedirectAfterPublish: boolean

}
class UmmVarForm extends React.Component<UmmVarFormProps, never> {
  model: UmmVarModel
  editor: MetadataEditor
  constructor(props: UmmVarFormProps) {
    super(props)
    const {
      token, user, provider, shouldRedirectAfterPublish
    } = this.props
    this.model = new UmmVarModel()
    this.editor = new MetadataEditor(this.model, token, user, provider, shouldRedirectAfterPublish)
  }

  render() {
    const { heading } = this.props
    return (
      <App editor={this.editor} heading={heading} />
    )
  }
}
export default observer(UmmVarForm)
