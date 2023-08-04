import { observer } from 'mobx-react'

import React from 'react'
import App from './App'
import MetadataEditor from './MetadataEditor'
import UmmServicesModel from './model/UmmServicesModel'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

interface UmmServicesFormProps {
  heading: string,
  token: string,
  user: string,
  provider: string,
  shouldRedirectAfterPublish: boolean
}

class UmmServicesForm extends React.Component<UmmServicesFormProps, never> {
  model: UmmServicesModel
  editor: MetadataEditor
  constructor(props: UmmServicesFormProps) {
    super(props)
    const {
      token, user, provider, shouldRedirectAfterPublish
    } = this.props
    this.model = new UmmServicesModel()
    this.editor = new MetadataEditor(this.model, token, user, provider, shouldRedirectAfterPublish)
  }

  render() {
    const { heading } = this.props
    return (
      <App editor={this.editor} heading={heading} />
    )
  }
}
export default observer(UmmServicesForm)
