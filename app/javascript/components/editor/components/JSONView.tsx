import { observer } from 'mobx-react'
import React from 'react'
import { Card } from 'react-bootstrap'
import JSONPretty from 'react-json-pretty'
import MetadataEditor from '../MetadataEditor'

type JSONViewProps = {
  editor: MetadataEditor;
}
type JSONViewState = {
  status: string
}

class JSONView extends React.Component<JSONViewProps, JSONViewState> {
  render() {
    const { editor } = this.props
    return (
      <Card>
        <Card.Header>JSON</Card.Header>
        <Card.Body id="json-text-field">
          <JSONPretty data={editor.fullData} />
        </Card.Body>
      </Card>
    )
  }
}
export default observer(JSONView)
